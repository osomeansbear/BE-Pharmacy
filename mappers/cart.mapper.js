const {
  CartItemOutputSchema,
  CartOutputSchema,
} = require("../validators/output/cart.output.validator.js");

class CartMapper {
  static mapItem(model) {
    const quantity = model.quantity.toString();
    const unitPrice = model.unitPrice.toString();
    const lineTotal = (Number(quantity) * Number(unitPrice)).toString();

    return CartItemOutputSchema.parse({
      id: model.id,
      userId: model.userId,
      productId: model.productId,
      productName: model.productName,
      productImage: model.productImage ?? null,
      unitType: model.unitType,
      quantity,
      unitPrice,
      conversionFactor: model.conversionFactor.toString(),
      lineTotal,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    });
  }

  static mapCart(items) {
    const mapped = items.map((item) => this.mapItem(item));
    const totalAmount = mapped
      .reduce((sum, item) => sum + Number(item.lineTotal), 0)
      .toString();

    return CartOutputSchema.parse({
      items: mapped,
      totalAmount,
    });
  }
}

module.exports = CartMapper;
