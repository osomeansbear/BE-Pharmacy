const { id } = require("zod/locales");
const BaseRepository = require("./base.repository.js");
const BrandRepository = require("./brand.repository.js");
const CategoryRepository = require("./category.repository.js");

class ProductRepository extends BaseRepository {
  constructor() {
    super("Product");
  }

  async findBySlug(slug) {
    const product = await this.findByField("slug", slug);

    return product ? { ...product } : null;
  }
}

module.exports = new ProductRepository();
