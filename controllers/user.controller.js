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
  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(200).json({ message: result.message, userId: result.userId });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateUser(req, res) {
    try {
      const result = await userService.updateUser(req.params.id, req.body);
      result.User.id = Number(result.User.id);
      res
        .status(200)
        .json({ updatedUser: result.User, message: result.message });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getUserById(req, res) {
    try {
      const result = await userService.getUserById(req.params.id);
      result.User.id = Number(result.User.id);
      res.status(200).json({ User: result.User, message: result.message });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getAllUsers(req, res) {
    try {
      const result = await userService.getAllUsers();
      console.log(result);
      for (i = 0; i < result.Users.length; i++) {
        result.Users[i].id = Number(result.Users[i].id);
        delete result.Users[i].password;
      }
      res.status(200).json({ Users: result.Users, message: result.message });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async loginUser(req, res) {
    try {
      const result = await userService.loginUser(
        req.body.email,
        req.body.password
      );

      console.log(result);
      res
        .status(200)
        .json({
          User: result.user,
          message: result.message,
          token: result.token,
        });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = userController;
