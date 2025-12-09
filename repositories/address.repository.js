const BaseRepository = require("./base.repository.js");
const prisma = require("../config/db.js");

class AddressRepository extends BaseRepository {
  constructor() {
    super("addresses");
  }

  async findByUserId(userId) {
    return this.findAll({ user_id: BigInt(userId) });
  }
}

module.exports = new AddressRepository();
