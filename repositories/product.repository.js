const BaseRepository = require("./base.repository.js");

class ProductRepository extends BaseRepository {
  constructor() {
    super("products");
  }
}

module.exports = new ProductRepository();
