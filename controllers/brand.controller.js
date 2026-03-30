const BaseController = require("./base.controller.js");
const brandService = require("../services/brand.service.js");

class BrandController extends BaseController {
  createBrand = async (req, res) => {
    try {
      const result = await brandService.createBrand(req.body);
      return this.success(
        res,
        { brand: result },
        "Create brand successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getAllBrands = async (req, res) => {
    try {
      const result = await brandService.getAllBrands();
      return this.success(
        res,
        { brands: result },
        "Get all brands successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getBrandById = async (req, res) => {
    try {
      const result = await brandService.getBrandById(req.params.id);
      return this.success(
        res,
        { brand: result },
        "Get brand successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  updateBrand = async (req, res) => {
    try {
      const result = await brandService.updateBrand(req.params.id, req.body);
      return this.success(
        res,
        { brand: result },
        "Update brand successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  deleteBrand = async (req, res) => {
    try {
      await brandService.deleteBrand(req.params.id);
      return res.status(204).send();
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new BrandController();
