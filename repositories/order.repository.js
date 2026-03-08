const prisma = require("../config/db.js");
const BaseRepository = require("./base.repository.js");

class OrderRepository extends BaseRepository {
  constructor() {
    super("Order");
  }

  async createWithItems(orderData, itemsData) {
    return prisma.$transaction(async (tx) => {
      // Deduct stock for each item atomically
      for (const item of itemsData) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          const err = new Error(`Product with id ${item.productId} not found`);
          err.statusCode = 404;
          throw err;
        }

        const baseQty = parseFloat(item.baseQty);
        if (product.stock < baseQty) {
          const err = new Error(
            `Insufficient stock for product ${item.productId}`,
          );
          err.statusCode = 400;
          throw err;
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: Math.ceil(baseQty) } },
        });
      }

      // Create order with nested items
      const order = await tx.order.create({
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

      return order;
    });
  }

  async findByIdWithItems(id) {
    return this.model.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
  }

  async findByUserIdWithItems(userId) {
    return this.model.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new OrderRepository();
