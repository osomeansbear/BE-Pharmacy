const BaseController = require("./base.controller");
const userService = require("../services/user.service");

class UserController extends BaseController {
  register = async (req, res) => {
    try {
      const result = await userService.register(req.body);

      this.success(res, result, "Register successful", 201);
    } catch (err) {
      this.error(res, err);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      this.success(res, result, result.message || "User deleted successfully");
    } catch (err) {
      this.error(res, err);
    }
  };

  updateUser = async (req, res) => {
    try {
      const result = await userService.updateUser(req.params.id, req.body);
      this.success(res, { user: result.user }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  getMe = async (req, res) => {
    try {
      const result = await userService.getMe(req.user.id);
      this.success(res, { user: result.user }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  updateMe = async (req, res) => {
    try {
      const result = await userService.updateMe(req.user.id, req.body);
      this.success(res, { user: result.user }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  getUserById = async (req, res) => {
    try {
      const result = await userService.getUserById(req.params.id);
      this.success(res, { user: result.user }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const result = await userService.getAllUsers();
      this.success(res, { users: result.users }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  updateStatus = async (req, res) => {
    try {
      const result = await userService.setUserStatus(
        req.params.id,
        req.body.isActive,
      );
      this.success(res, { user: result.user }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  updateRole = async (req, res) => {
    try {
      const result = await userService.setUserRole(
        req.params.id,
        req.body.role,
      );
      this.success(res, { user: result.user }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  getHealthProfile = async (req, res) => {
    try {
      const result = await userService.getHealthProfile(req.user.id);
      this.success(res, result, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  upsertHealthProfile = async (req, res) => {
    try {
      const result = await userService.upsertHealthProfile(
        req.user.id,
        req.body,
      );
      this.success(res, result, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
      this.success(res, {}, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await userService.loginUser(email, password);

      this.success(res, result, "Login successful");
    } catch (err) {
      this.error(res, err);
    }
  };
}

module.exports = new UserController();
