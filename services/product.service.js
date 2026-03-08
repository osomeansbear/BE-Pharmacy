const { brand } = require("../config/db.js");
const ProductDetailRepository = require("../repositories/detail.repository.js");
const ProductRepository = require("../repositories/product.repository.js");
const { convertToSlug } = require("../utils/convertToSlug.js");

class productService {
  async createProduct(data) {
    const { name } = data;

    const slug = convertToSlug(data.slug) || convertToSlug(name);

    const newProduct = await ProductRepository.create({
      name,
      slug,
    });
    return {
      newProduct,
    };
  }

  async getProductBySlug(slug) {
    const product = await ProductRepository.findBySlug(slug);
    return product;
  }

  async getAllProducts() {
    const products = await ProductRepository.findAll();
    return products;
  }

  async getProductDetail() {
    const detail = await ProductDetailRepository.getDetailBySlug();
    return detail;
  }
}

module.exports = new productService();
