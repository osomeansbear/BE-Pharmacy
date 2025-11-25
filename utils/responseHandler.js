class ResponseHandler {
  // thành công
  success(res, data = null, message = "Success", status = 200) {
    res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  error(res, message = "Something went wrong", status = 500, data = null) {
    res.status(status).json({
      success: false,
      message,
      data,
    });
  }

  //  data pagination
  //   paginated(res, data, page = 1, limit = 10, total = 0, message = "Success") {
  //     res.status(200).json({
  //       success: true,
  //       message,
  //       data,
  //       pagination: {
  //         page,
  //         limit,
  //         total,
  //         totalPages: Math.ceil(total / limit),
  //       },
  //     });
  //   }
}

module.exports = new ResponseHandler();
