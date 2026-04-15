const OrderRepository = require("../repositories/order.repository.js");
const UserRepository = require("../repositories/user.repository.js");
const OrderMapper = require("../mappers/order.mapper.js");
const AddressRepository = require("../repositories/address.repository.js");
const ProductRepository = require("../repositories/product.repository.js");

// Allowed status transitions for admin
const TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

class OrderService {
  async getAllOrders() {
    const orders = await OrderRepository.findAllWithItems();
    const decorated = await this.#addImagesToOrders(orders);
    return decorated.map((order) => OrderMapper.mapOrder(order));
  }

  async getMyOrders(userId) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const orders = await OrderRepository.findByUserIdWithItems(Number(userId));
    const decorated = await this.#addImagesToOrders(orders);
    return decorated.map((order) => OrderMapper.mapOrder(order));
  }

  async getMyOrderById(userId, orderId) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const order = await OrderRepository.findByIdAndUserWithItems(orderId, userId);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    const [decorated] = await this.#addImagesToOrders([order]);
    return OrderMapper.mapOrder(decorated);
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

    const { orderItems, totalAmount } = await this.#buildOrderItems(items);

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
      // PENDING: awaiting payment (ONLINE) or admin confirmation (CASH/CARD)
      status: "PENDING",
    };

    const createdOrder = await OrderRepository.createWithItems(orderData, orderItems);
    return OrderMapper.mapOrder(createdOrder);
  }

  async adminCreateOrder(data) {
    const { userId, guestInfo, shippingAddress, paymentMethod, items } = data;

    let orderData = { shippingAddress, paymentMethod };

    if (userId !== undefined) {
      const user = await UserRepository.findById(userId);
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      if (!user.isActive) {
        const err = new Error("Cannot create order for a deactivated user");
        err.statusCode = 400;
        throw err;
      }
      orderData.userId = Number(userId);
      orderData.userEmail = user.email;
      orderData.guestName = null;
      orderData.guestPhone = null;
    } else {
      // Walk-in guest — no user account
      orderData.userId = null;
      orderData.userEmail = null;
      orderData.guestName = guestInfo.name;
      orderData.guestPhone = guestInfo.phone;
    }

    const { orderItems, totalAmount } = await this.#buildOrderItems(items);

    orderData.totalAmount = totalAmount.toString();
    // In-store orders start CONFIRMED — payment is taken at the counter
    orderData.status = "CONFIRMED";

    const createdOrder = await OrderRepository.createWithItems(orderData, orderItems);
    return OrderMapper.mapOrder(createdOrder);
  }

  // Simulate online payment: PENDING (ONLINE) → CONFIRMED
  async payOrder(userId, orderId) {
    const id = Number(orderId);
    const order = await OrderRepository.findByIdWithItems(id);

    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    if (order.userId !== Number(userId)) {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }

    if (order.paymentMethod !== "ONLINE") {
      const err = new Error(
        "Payment simulation is only available for ONLINE payment orders",
      );
      err.statusCode = 400;
      throw err;
    }

    if (order.status !== "PENDING") {
      const err = new Error("Only pending orders can be paid");
      err.statusCode = 400;
      throw err;
    }

    const updatedOrder = await OrderRepository.updateStatus(id, "CONFIRMED");
    const [decorated] = await this.#addImagesToOrders([updatedOrder]);
    return OrderMapper.mapOrder(decorated);
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

      // Patients may only cancel their own PENDING orders
      if (order.status !== "PENDING" || nextStatus !== "CANCELLED") {
        const err = new Error("Users can only cancel their own pending orders");
        err.statusCode = 400;
        throw err;
      }
    }

    const allowedNext = TRANSITIONS[order.status] || [];
    if (!allowedNext.includes(nextStatus)) {
      const err = new Error(
        `Invalid status transition: ${order.status} → ${nextStatus}`,
      );
      err.statusCode = 400;
      throw err;
    }

    const updatedOrder = await OrderRepository.updateStatus(id, nextStatus);
    const [decorated] = await this.#addImagesToOrders([updatedOrder]);
    return OrderMapper.mapOrder(decorated);
  }

  // ── private helpers ──────────────────────────────────────────────────────

  async #addImagesToOrders(orders) {
    const productIds = [...new Set(orders.flatMap((o) => o.items.map((i) => i.productId)))];
    if (!productIds.length) return orders;

    const products = await ProductRepository.findManyByIds(productIds, { id: true, image: true });
    const imageMap = new Map(products.map((p) => [p.id, p.image?.[0] ?? null]));

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productImage: imageMap.get(item.productId) ?? null,
      })),
    }));
  }

  async #buildOrderItems(items) {
    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await ProductRepository.findActiveByIds(productIds, {
      id: true,
      name: true,
      stock: true,
      isActive: true,
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

      if (product.stock < baseQty) {
        const err = new Error(
          `Insufficient stock for "${product.name}". Required: ${baseQty}, Available: ${product.stock}`,
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

    return { orderItems, totalAmount };
  }
}

module.exports = new OrderService();
