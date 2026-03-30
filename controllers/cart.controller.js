const BaseController = require("./base.controller.js");
const CartService = require("../services/cart.service.js");

class CartController extends BaseController {
  getMyCart = async (req, res) => {
    try {
      const result = await CartService.getMyCart(req.user.id);
      return this.success(res, { cart: result }, "Get cart successfully", 200);
    } catch (err) {
      return this.error(res, err);
    }
  };

  addItem = async (req, res) => {
    try {
      const result = await CartService.addItem(req.user.id, req.body);
      return this.success(
        res,
        { cart: result },
        "Add item to cart successfully",
        201,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  updateItem = async (req, res) => {
    try {
      const result = await CartService.updateItem(
        req.user.id,
        req.params.id,
        req.body,
      );
      return this.success(
        res,
        { cart: result },
        "Update cart item successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  removeItem = async (req, res) => {
    try {
      const result = await CartService.removeItem(req.user.id, req.params.id);
      return this.success(
        res,
        { cart: result },
        "Remove cart item successfully",
        200,
      );
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new CartController();
