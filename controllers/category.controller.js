const categoryService = require("../services/category.service.js");
const BaseController = require("./base.controller.js");
class CategoryController extends BaseController {
  createCategory = async (req, res) => {
    try {
      const result = await categoryService.createCategory(req.body);
      // Data format: { Category: result }

      return this.success(res, result, "Created successfully", 201);
    } catch (err) {
      return this.error(res, err);
    }
  };

  getAllCategories = async (req, res) => {
    try {
      const result = await categoryService.getAllCategories();
      return this.success(
        res,
        { categories: result },
        "Get all categories successfully",
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getCategoryById = async (req, res) => {
    try {
      const result = await categoryService.getCategoryById(req.params.id);
      if (!result) {
        return this.error(res, {
          message: "Category not found",
          statusCode: 404,
        });
      }
      return this.success(
        res,
        { category: result },
        "Get category successfully",
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  updateCategory = async (req, res) => {
    try {
      const result = await categoryService.updateCategory(
        req.params.id,
        req.body,
      );
      return this.success(res, { category: result }, "Updated successfully");
    } catch (err) {
      return this.error(res, err);
    }
  };

  deleteCategory = async (req, res) => {
    try {
      await categoryService.deleteCategory(req.params.id);
      // HTTP 204 No Content thường không trả về body
      return res.status(204).send();
    } catch (err) {
      return this.error(res, err);
    }
  };
}

// Export một instance của class
module.exports = new CategoryController();
