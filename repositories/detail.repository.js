const BaseRepository = require("./base.repository");
const brandRepository = require("./brand.repository");
const productRepository = require("./product.repository");

class ProductDetailRepository extends BaseRepository {
  constructor() {
    super("ProductDetail");
  }

  async getDetailBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    const brand = await brandRepository.findById(product.brandId);
    console.log(brand);
    const detail = await this.findByField(product.id);
    return { ...product, ...detail, brand: brand };
  }
}
module.exports = new ProductDetailRepository();
