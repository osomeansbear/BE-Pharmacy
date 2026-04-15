const prisma = require("../config/db.js");

const LOW_STOCK_THRESHOLD = 10;

class AdminService {
  async getStats() {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalUsers,
      activeUsers,
      orderCounts,
      revenueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lt: LOW_STOCK_THRESHOLD } } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["CONFIRMED", "DELIVERED"] } },
      }),
    ]);

    const ordersByStatus = { PENDING: 0, CONFIRMED: 0, DELIVERED: 0, CANCELLED: 0 };
    for (const row of orderCounts) {
      ordersByStatus[row.status] = row._count.id;
    }

    const totalOrders = Object.values(ordersByStatus).reduce((a, b) => a + b, 0);
    const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0);

    return {
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus,
      },
      revenue: totalRevenue,
      users: {
        total: totalUsers,
        active: activeUsers,
      },
    };
  }
}

module.exports = new AdminService();
