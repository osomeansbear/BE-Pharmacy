const CartRepository = require("../repositories/cart.repository.js");
const CartMapper = require("../mappers/cart.mapper.js");
const ProductRepository = require("../repositories/product.repository.js");

class CartService {
  async getMyCart(userId) {
    this.#assertUser(userId);

    const items = await CartRepository.findByUser(userId);
    const decorated = await this.#decorate(items);
    return CartMapper.mapCart(decorated);
  }

  async addItem(userId, payload) {
    this.#assertUser(userId);

    const { productId, unitType } = payload;
    const qty = Number(payload.quantity);

    const [product, unit, existing] = await Promise.all([
      ProductRepository.findById(Number(productId)),
      ProductRepository.findUnitByProductAndType(productId, unitType),
      CartRepository.findByUserProductUnit(userId, productId, unitType),
    ]);

    if (!product || !product.isActive) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    if (!unit) {
      const err = new Error("Unit type is not available for this product");
      err.statusCode = 400;
      throw err;
    }

    if (existing) {
      await CartRepository.update(existing.id, {
        quantity: (Number(existing.quantity) + qty).toString(),
      });
    } else {
      await CartRepository.create({
        userId: Number(userId),
        productId: Number(productId),
        unitType,
        quantity: qty.toString(),
      });
    }

    return this.getMyCart(userId);
  }

  async updateItem(userId, cartItemId, payload) {
    this.#assertUser(userId);

    const item = await CartRepository.findByIdAndUser(cartItemId, userId);
    if (!item) {
      const err = new Error("Cart item not found");
      err.statusCode = 404;
      throw err;
    }

    await CartRepository.update(item.id, {
      quantity: Number(payload.quantity).toString(),
    });

    return this.getMyCart(userId);
  }

  async removeItem(userId, cartItemId) {
    this.#assertUser(userId);

    const item = await CartRepository.findByIdAndUser(cartItemId, userId);
    if (!item) {
      const err = new Error("Cart item not found");
      err.statusCode = 404;
      throw err;
    }

    await CartRepository.delete(item.id);
    return this.getMyCart(userId);
  }

  async clearByProductIds(userId, productIds) {
    this.#assertUser(userId);

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return this.getMyCart(userId);
    }

    await CartRepository.deleteByUserAndProductIds(userId, productIds);
    return this.getMyCart(userId);
  }

  #assertUser(userId) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }
  }

  async #decorate(items) {
    if (!items.length) return [];

    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await ProductRepository.findManyByIds(productIds, { id: true, name: true });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const units = await ProductRepository.findUnitsByConditions(
      items.map((i) => ({ productId: i.productId, unitType: i.unitType })),
      { productId: true, unitType: true, price: true, conversionFactor: true },
    );
    const unitMap = new Map(
      units.map((u) => [`${u.productId}:${u.unitType}`, u]),
    );

    return items.map((item) => {
      const product = productMap.get(item.productId);
      const unit = unitMap.get(`${item.productId}:${item.unitType}`);
      return {
        ...item,
        productName: product ? product.name : "Unknown product",
        unitPrice: unit ? unit.price : 0,
        conversionFactor: unit ? unit.conversionFactor : 0,
      };
    });
  }
}

module.exports = new CartService();
