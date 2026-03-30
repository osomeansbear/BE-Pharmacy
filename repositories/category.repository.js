const BaseRepository = require("./base.repository.js");

class CategoryRepository extends BaseRepository {
  constructor() {
    super("Category");
  }

  async findByName(name) {
    const category = await this.findByField("name", name);
    return category ? { ...category, id: Number(category.id) } : null;
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

module.exports = new CategoryRepository();
