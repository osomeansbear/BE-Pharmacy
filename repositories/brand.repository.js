const BaseRepository = require("./base.repository.js");

class BrandRepository extends BaseRepository {
  constructor() {
    super("Brand");
  }

  async findByName(name) {
    const brand = await this.findByField("name", name);
    return brand ? { ...brand, id: Number(brand.id) } : null;
  }

  async findAll(filter = {}, include = {}) {
    return this.model.findMany({
      where: { ...filter, isActive: true },
      include,
    });
  }

  async softDelete(id) {
    return this.update(Number(id), { isActive: false });
  }
}

module.exports = new BrandRepository();
