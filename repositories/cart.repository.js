const BaseRepository = require("./base.repository.js");

class CartRepository extends BaseRepository {
  constructor() {
    super("CartItem");
  }

  async findByUser(userId) {
    return this.model.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByUserProductUnit(userId, productId, unitType) {
    return this.model.findFirst({
      where: {
        userId: Number(userId),
        productId: Number(productId),
        unitType,
      },
    });
  }

  async findByIdAndUser(id, userId) {
    return this.model.findFirst({
      where: { id: Number(id), userId: Number(userId) },
    });
  }

  async deleteByUserAndProductIds(userId, productIds) {
    return this.model.deleteMany({
      where: {
        userId: Number(userId),
        productId: { in: productIds.map((id) => Number(id)) },
      },
    });
  }
}

module.exports = new CartRepository();
