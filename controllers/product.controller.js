const productService = require("../services/product.service.js");
const BaseController = require("./base.controller.js");

class ProductController extends BaseController {
  // Đổi sang arrow function ở đây
  createProduct = async (req, res) => {
    try {
      const result = await productService.createProduct(req.body);
      return this.success(
        res,
        { data: result },
        "Create product successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getAllProducts = async (req, res) => {
    try {
      const result = await productService.getAllProducts();
      return this.success(
        res,
        { data: result },
        "Get all products successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getProductDetail = async (req, res) => {
    try {
      const result = await productService.getProductDetail();
      return this.success(
        res,
        { data: result },
        "Get product detail successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new ProductController();
