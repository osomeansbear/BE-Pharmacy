const categoryService = require("../services/category.service.js");

const categoryController = {
  async createCategory(req, res) {
    try {
      const result = await categoryService.createCategory(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllCategories(req, res) {
    try {
      const result = await categoryService.getAllCategories();
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getCategoryById(req, res) {
    try {
      const result = await categoryService.getCategoryById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const result = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = categoryController;
