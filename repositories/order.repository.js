const prisma = require("../config/db.js");
const BaseRepository = require("./base.repository.js");

class OrderRepository extends BaseRepository {
  constructor() {
    super("Order");
  }

  async createWithItems(orderData, itemsData) {
    return prisma.$transaction(async (tx) => {
      for (const item of itemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: Number(item.baseQty) } },
        });
      }
      return tx.order.create({
        data: {
          ...orderData,
          items: { create: itemsData },
        },
        include: { items: true },
      });
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
    if (status === "CANCELLED") {
      return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id },
          include: { items: true },
        });
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: Number(item.baseQty) } },
          });
        }
        return tx.order.update({
          where: { id },
          data: { status },
          include: { items: true },
        });
      });
    }
    return this.model.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }
}

module.exports = new OrderRepository();
