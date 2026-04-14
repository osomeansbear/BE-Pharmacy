const bcrypt = require("bcrypt");
const AccountRepository = require("../repositories/account.repository.js");

const accountService = {
  async createAccount(userId, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await AccountRepository.create({
      userId,
      password: hashedPassword,
    });

    return account;
  },

  async compareEntityPassword(userId, password) {
    const account = await AccountRepository.findByUserId(userId);

    if (!account || !account.password) {
      return false;
    }
    const isMatch = await bcrypt.compare(password, account.password);

    return isMatch;
  },
};

module.exports = accountService;
