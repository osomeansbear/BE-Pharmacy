const productService = require("../services/product.service.js");
const BaseController = require("./base.controller.js");

class ProductController extends BaseController {
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
      const result = await productService.getAllProducts(req.query);
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
      const result = await productService.getProductDetail(req.params.slug);
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

  updateProduct = async (req, res) => {
    try {
      const result = await productService.updateProduct(
        req.params.id,
        req.body,
      );
      return this.success(
        res,
        { data: result },
        "Update product successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id);
      return res.status(204).send();
    } catch (err) {
      return this.error(res, err);
    }
  };

  createDetail = async (req, res) => {
    try {
      const result = await productService.upsertDetail(req.params.id, req.body);
      return this.success(
        res,
        { data: result },
        "Create product detail successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  updateDetail = async (req, res) => {
    try {
      const result = await productService.upsertDetail(req.params.id, req.body);
      return this.success(
        res,
        { data: result },
        "Update product detail successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  addUnit = async (req, res) => {
    try {
      const result = await productService.addUnit(req.params.id, req.body);
      return this.success(
        res,
        { data: result },
        "Add product unit successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  updateUnit = async (req, res) => {
    try {
      const result = await productService.updateUnit(
        req.params.id,
        req.params.unitId,
        req.body,
      );
      return this.success(
        res,
        { data: result },
        "Update product unit successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  deleteUnit = async (req, res) => {
    try {
      await productService.deleteUnit(req.params.id, req.params.unitId);
      return res.status(204).send();
    } catch (err) {
      return this.error(res, err);
    }
  };

  assignCategory = async (req, res) => {
    try {
      const result = await productService.assignCategory(
        req.params.id,
        req.body.categoryId,
      );
      return this.success(
        res,
        { data: result },
        "Assign category successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  removeCategory = async (req, res) => {
    try {
      await productService.removeCategory(req.params.id, req.params.categoryId);
      return res.status(204).send();
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new ProductController();
