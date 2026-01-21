const BaseRepository = require("./base.repository.js");

class BrandRepository extends BaseRepository {
  constructor() {
    super("brands");
  }

  async findByName(name) {
    const brand = await this.findByField("name", name);
    return brand ? { ...brand, id: Number(brand.id) } : null;
  }
}

module.exports = new BrandRepository();
