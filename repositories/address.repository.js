const BaseRepository = require("./base.repository.js");

class AddressRepository extends BaseRepository {
  constructor() {
    super("Address");
  }

  async findByUserId(userId) {
    return this.findAll({ userId: Number(userId) });
  }
}

module.exports = new AddressRepository();
