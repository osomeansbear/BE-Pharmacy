const BaseRepository = require("./base.repository.js");

class AccountRepository extends BaseRepository {
  constructor() {
    super("Account");
  }

  async findByUserId(userId) {
    return this.findByField("userId", userId);
  }
}

module.exports = new AccountRepository();
