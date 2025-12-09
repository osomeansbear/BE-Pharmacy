const addressService = require("../services/address.service.js");

const addressController = {
  async createAddress(req, res) {
    try {
      const result = await addressService.createAddress(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = addressController;
