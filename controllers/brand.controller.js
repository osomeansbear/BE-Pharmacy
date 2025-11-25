const brandService = require("../services/brand.service.js");

const brandController = {
  async createBrand(req, res) {
    try {
      const result = await brandService.createBrand(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllBrands(req, res) {
    try {
      const result = await brandService.getAllBrands();
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getBrandById(req, res) {
    try {
      const result = await brandService.getBrandById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateBrand(req, res) {
    try {
      const result = await brandService.updateBrand(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteBrand(req, res) {
    try {
      await brandService.deleteBrand(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = brandController;
