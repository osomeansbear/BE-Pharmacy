const BaseController = require("./base.controller.js");
const orderService = require("../services/order.service.js");

class OrderController extends BaseController {
  getAllOrders = async (req, res) => {
    try {
      const result = await orderService.getAllOrders();
      return this.success(
        res,
        { orders: result },
        "Get all orders successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getMyOrders = async (req, res) => {
    try {
      const result = await orderService.getMyOrders(req.user.id);
      return this.success(
        res,
        { orders: result },
        "Get my orders successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  getMyOrderById = async (req, res) => {
    try {
      const result = await orderService.getMyOrderById(
        req.user.id,
        req.params.id,
      );
      return this.success(
        res,
        { order: result },
        "Get order detail successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

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

  updateOrderStatus = async (req, res) => {
    try {
      const result = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.user,
      );
      return this.success(
        res,
        { order: result },
        "Order status updated successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  cancelOrder = async (req, res) => {
    try {
      const result = await orderService.updateOrderStatus(
        req.params.id,
        "CANCELLED",
        req.user,
      );
      return this.success(
        res,
        { order: result },
        "Order cancelled successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new OrderController();
