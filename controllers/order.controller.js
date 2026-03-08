const BaseController = require("./base.controller.js");
const orderService = require("../services/order.service.js");
const paymentService = require("../services/payment.service.js");

class OrderController extends BaseController {
  createOrder = async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await orderService.createOrder(userId, req.body);
      return this.success(
        res,
        { order: result },
        "Create order successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  processPayment = async (req, res) => {
    try {
      const userId = req.user.id;
      const orderId = req.params.orderId;
      const result = await paymentService.processPayment(
        userId,
        orderId,
        req.body,
      );
      return this.success(
        res,
        { payment: result.payment, order: result.order },
        "Payment processed successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new OrderController();
