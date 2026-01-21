const productService = require("../services/product.service.js");

const productController = {
  async createProduct(req, res) {
    try {
      const result = await productService.createProduct(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProducts();
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = productController;
