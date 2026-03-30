class BaseController {
  success(res, data = {}, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      message,
      ...data,
    });
  }

  error(res, err) {
    console.error("Controller Error:", err);

    const statusCode = err.statusCode || 400;

    return res.status(statusCode).json({
      message: err.message || "Internal Server Error",
    });
  }
}

module.exports = BaseController;
