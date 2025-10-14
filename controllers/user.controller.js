const userService = require("../services/user.service.js");

const userController = {
  async register(req, res) {
    try {
      const result = await userService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = userController;
