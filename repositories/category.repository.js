const BaseRepository = require("./base.repository.js");

class CategoryRepository extends BaseRepository {
  constructor() {
    super("categories");
  }

  async findByName(name) {
    const category = await this.findByField("name", name);
    return category ? { ...category, id: Number(category.id) } : null;
  }
}

module.exports = new CategoryRepository();
