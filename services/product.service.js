const ProductRepository = require("../repositories/product.repository.js");

const productService = {
  async createProduct(data) {
    const { category_id, name, description, price, stock } = data;
    const newProduct = await ProductRepository.create({
      category_id,
      name,
      description,
      price,
      stock,
    });
    return {
      ...newProduct,
      id: Number(newProduct.id),
    };
  },

  async getAllProducts() {
    const products = await ProductRepository.findAll();
    return products.map((product) => ({
      ...product,
      id: product.id,
    }));
  },
};

module.exports = productService;
