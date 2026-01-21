// controllers/base.controller.js

class BaseController {
  /**
   * Phản hồi thành công chuẩn
   * @param {Object} res - Express response object
   * @param {Object} data - Dữ liệu trả về (VD: { User: ... })
   * @param {String} message - Thông báo (mặc định là "Success")
   * @param {Number} statusCode - HTTP status code (mặc định 200)
   */
  success(res, data = {}, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      message,
      ...data, // Spread dữ liệu để khớp với format cũ: { message, User: ... }
    });
  }

  /**
   * Xử lý lỗi tập trung
   * @param {Object} res - Express response object
   * @param {Error} err - Error object
   */
  error(res, err) {
    console.error("Controller Error:", err); // Log lỗi để debug

    // Mặc định lỗi là 400 (Bad Request) nếu không xác định,
    // hoặc 500 nếu là lỗi hệ thống nghiêm trọng
    const statusCode = err.statusCode || 400;

    return res.status(statusCode).json({
      error: err.message || "Internal Server Error",
    });
  }
}

module.exports = BaseController;
