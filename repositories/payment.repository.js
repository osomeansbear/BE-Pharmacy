const BaseRepository = require("./base.repository.js");

class PaymentRepository extends BaseRepository {
  constructor() {
    super("Payment");
  }

  async findByOrderId(orderId) {
    return this.findByField("orderId", orderId);
  }
}

module.exports = new PaymentRepository();
