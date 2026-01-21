const BaseRepository = require("./base.repository.js");

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async findByEmail(email) {
    const user = await this.findByField("email", email);
    return user ? { ...user } : null;
  }

  async findByRole(role) {
    const user = await this.findMany({ where: { role } });
    return user ? { ...user } : null;
  }

  async activateUser(id) {
    const user = await this.update({
      where: { id },
      data: { is_active: true },
    });
    return user ? { ...user } : null;
  }

  async deactivateUser(id) {
    const user = await this.update({
      where: { id },
      data: { is_active: false },
    });
    return user ? { ...user } : null;
  }

  async addLoyaltyPoints(id, points) {
    const user = await this.update({
      where: { id },
      data: { loyalty_points: { increment: points } },
    });
    return user ? { ...user } : null;
  }
}

module.exports = new UserRepository();
