const {
  OrderOutput,
  OrderItemOutput,
} = require("../validators/output/order.output.validator.js");

class OrderMapper {
  static #toStringOrNull(value) {
    if (value === null || value === undefined) return null;
    return value.toString();
  }

  static mapOrderItem(item) {
    return OrderItemOutput.parse({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitType: item.unitType,
      quantity: this.#toStringOrNull(item.quantity),
      baseQty: this.#toStringOrNull(item.baseQty),
      unitPrice: this.#toStringOrNull(item.unitPrice),
    });
  }

  static mapOrder(order) {
    return OrderOutput.parse({
      id: order.id,
      userId: order.userId ?? null,
      userEmail: order.userEmail,
      shippingAddress: {
        province: order.shippingAddress.province,
        district: order.shippingAddress.district,
        ward: order.shippingAddress.ward,
        detail: order.shippingAddress.detail,
      },
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: this.#toStringOrNull(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: (order.items || []).map((item) => this.mapOrderItem(item)),
    });
  }
}

module.exports = OrderMapper;
