const OrderRepository = require("../repositories/order.repository.js");
const UserRepository = require("../repositories/user.repository.js");
const OrderMapper = require("../mappers/order.mapper.js");
const AddressRepository = require("../repositories/address.repository.js");
const ProductRepository = require("../repositories/product.repository.js");

class OrderService {
  async getAllOrders() {
    const orders = await OrderRepository.findAllWithItems();
    return orders.map((order) => OrderMapper.mapOrder(order));
  }

  async getMyOrders(userId) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const orders = await OrderRepository.findByUserIdWithItems(Number(userId));
    return orders.map((order) => OrderMapper.mapOrder(order));
  }

  async getMyOrderById(userId, orderId) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const order = await OrderRepository.findByIdAndUserWithItems(
      orderId,
      userId,
    );
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    return OrderMapper.mapOrder(order);
  }

  async createOrder(userId, data) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const { addressId, paymentMethod, items } = data;

    const [user, address] = await Promise.all([
      UserRepository.findById(userId),
      AddressRepository.findById(addressId),
    ]);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    if (!address || address.userId !== Number(userId)) {
      const err = new Error("Address not found or does not belong to user");
      err.statusCode = 400;
      throw err;
    }

    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await ProductRepository.findActiveByIds(productIds, {
      id: true, name: true, stock: true, isActive: true,
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const unit = await ProductRepository.findUnitByProductAndType(
        item.productId,
        item.unitType,
        { conversionFactor: true, price: true },
      );

      const product = productMap.get(item.productId);
      if (!product || !unit) {
        const err = new Error(
          `Product/unit not found for productId=${item.productId}, unitType=${item.unitType}`,
        );
        err.statusCode = 400;
        throw err;
      }

      const quantity = Number(item.quantity);
      const conversionFactor = Number(unit.conversionFactor);
      const unitPrice = Number(unit.price);
      const baseQty = quantity * conversionFactor;

      if (Number.isNaN(baseQty) || baseQty <= 0) {
        const err = new Error(`Invalid quantity for product ${item.productId}`);
        err.statusCode = 400;
        throw err;
      }

      // Stock validation: check if available stock is sufficient
      if (product.stock < baseQty) {
        const err = new Error(
          `Insufficient stock for product "${product.name}". Required: ${baseQty}, Available: ${product.stock}`,
        );
        err.statusCode = 400;
        throw err;
      }

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        unitType: item.unitType,
        quantity: quantity.toString(),
        baseQty: baseQty.toString(),
        unitPrice: unitPrice.toString(),
      });

      totalAmount += quantity * unitPrice;
    }

    const orderData = {
      userId: Number(userId),
      userEmail: user.email,
      shippingAddress: {
        province: address.province,
        district: address.district,
        ward: address.ward,
        detail: address.detail,
        isDefault: address.isDefault,
      },
      paymentMethod,
      totalAmount: totalAmount.toString(),
    };

    const createdOrder = await OrderRepository.createWithItems(
      orderData,
      orderItems,
    );
    return OrderMapper.mapOrder(createdOrder);
  }

  async updateOrderStatus(orderId, nextStatus, actor = null) {
    const id = Number(orderId);
    if (!id) {
      const err = new Error("Invalid order id");
      err.statusCode = 400;
      throw err;
    }

    const order = await OrderRepository.findByIdWithItems(id);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    if (order.status === nextStatus) {
      return OrderMapper.mapOrder(order);
    }

    const isAdmin = actor?.role === "ADMIN";
    if (actor && !isAdmin) {
      if (!actor.id) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
      }

      if (order.userId !== Number(actor.id)) {
        const err = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
      }

      if (order.status !== "PENDING" || nextStatus !== "CANCELLED") {
        const err = new Error("Users can only cancel their own pending orders");
        err.statusCode = 400;
        throw err;
      }
    }

    const transitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["DELIVERED"],
      DELIVERED: ["RETURNED"],
      CANCELLED: [],
      RETURNED: [],
    };

    const allowedNext = transitions[order.status] || [];
    if (!allowedNext.includes(nextStatus)) {
      const err = new Error(
        `Invalid status transition: ${order.status} -> ${nextStatus}`,
      );
      err.statusCode = 400;
      throw err;
    }

    const updatedOrder = await OrderRepository.updateStatus(id, nextStatus);
    return OrderMapper.mapOrder(updatedOrder);
  }
}

module.exports = new OrderService();
