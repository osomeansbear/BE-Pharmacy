const prisma = require("../config/db.js");
const BaseRepository = require("./base.repository.js");

class OrderRepository extends BaseRepository {
  constructor() {
    super("Order");
  }

  async createWithItems(orderData, itemsData) {
    return this.model.create({
      data: {
        ...orderData,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findByIdWithItems(id) {
    return this.model.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async findByUserIdWithItems(userId) {
    return this.model.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllWithItems() {
    return this.model.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdAndUserWithItems(id, userId) {
    return this.model.findFirst({
      where: { id: Number(id), userId: Number(userId) },
      include: { items: true },
    });
  }

  async updateStatus(id, status) {
    return this.model.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }
}

module.exports = new OrderRepository();
