const BaseRepository = require("./base.repository.js");

class UserRepository extends BaseRepository {
  constructor() {
    super("User");
  }

  async findByEmail(email) {
    const user = await this.findByField("email", email);
    return user ? { ...user } : null;
  }

  async findByEmailWithProfile(email) {
    return this.model.findFirst({
      where: { email },
      include: { address: true, patientProfile: true },
    });
  }

  async findByIdWithProfile(id) {
    return this.model.findUnique({
      where: { id: Number(id) },
      include: { address: true, patientProfile: true },
    });
  }

  async findAllWithProfile() {
    return this.model.findMany({
      include: { address: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByRole(role) {
    const user = await this.findMany({ where: { role } });
    return user ? { ...user } : null;
  }

  async activateUser(id) {
    const user = await this.update(Number(id), { isActive: true });
    return user ? { ...user } : null;
  }

  async deactivateUser(id) {
    const user = await this.update(Number(id), { isActive: false });
    return user ? { ...user } : null;
  }

  async addLoyaltyPoints(id, points) {
    void id;
    void points;
    throw new Error("Loyalty points are not configured on the User model");
  }
}

module.exports = new UserRepository();
