// controllers/user.controller.js
const BaseController = require("./base.controller");
const userService = require("../services/user.service");

class UserController extends BaseController {
  // Dùng arrow function để bind 'this' tự động, tránh lỗi mất context
  register = async (req, res) => {
    try {
      // Giả sử userService.register đã trả về { User: ... } qua Mapper
      const result = await userService.register(req.body);

      this.success(res, result, "Register successful", 201);
    } catch (err) {
      this.error(res, err);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      // result có thể là { userId: 123 }
      this.success(res, result, result.message || "User deleted successfully");
    } catch (err) {
      this.error(res, err);
    }
  };

  updateUser = async (req, res) => {
    try {
      const result = await userService.updateUser(req.params.id, req.body);
      // result: { User: updatedUser }
      this.success(res, { updatedUser: result.User }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  getUserById = async (req, res) => {
    try {
      const result = await userService.getUserById(req.params.id);
      this.success(res, { User: result.User }, result.message);
    } catch (err) {
      // BaseController sẽ tự xử lý status code
      this.error(res, err);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const result = await userService.getAllUsers();
      // Không cần vòng lặp for để convert ID hay xóa password ở đây nữa
      // Mapper trong Service đã làm việc đó rồi.
      this.success(res, { Users: result.Users }, result.message);
    } catch (err) {
      this.error(res, err);
    }
  };

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);

      // result từ service Login (đã qua Mapper) thường có dạng:
      // { message: "...", data: { user: ..., token: ... } }
      // Ta lấy data để trả về
      this.success(res, result, "Login successful");
    } catch (err) {
      this.error(res, err);
    }
  };
}

module.exports = new UserController();
