const BaseRepository = require("./base.repository.js");
const prisma = require("../config/db.js");

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async findByEmail(email) {
    const user = await this.findByField("email", email);
    return user ? { ...user } : null;
  }

  async findByRole(role) {
    return prisma.users.findMany({ where: { role } });
  }

  async activateUser(id) {
    return prisma.users.update({
      where: { id },
      data: { is_active: true },
    });
  }

  async deactivateUser(id) {
    return prisma.users.update({
      where: { id },
      data: { is_active: false },
    });
  }

  async addLoyaltyPoints(id, points) {
    return prisma.users.update({
      where: { id },
      data: { loyalty_points: { increment: points } },
    });
  }
}

module.exports = new UserRepository();
