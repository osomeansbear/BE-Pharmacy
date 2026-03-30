const express = require("express");
const cartController = require("../controllers/cart.controller.js");
const validateData = require("../middlewares/validator.js");
const { verifyUser } = require("../middlewares/authenticaton.js");
const {
  addCartItemSchema,
  updateCartItemSchema,
  cartItemIdParamsSchema,
} = require("../validators/input/cart.input.validator.js");

const router = express.Router();

router.get("/", verifyUser, cartController.getMyCart);
router.post(
  "/items",
  verifyUser,
  validateData({ body: addCartItemSchema }),
  cartController.addItem,
);
router.patch(
  "/items/:id",
  verifyUser,
  validateData({ params: cartItemIdParamsSchema, body: updateCartItemSchema }),
  cartController.updateItem,
);
router.delete(
  "/items/:id",
  verifyUser,
  validateData({ params: cartItemIdParamsSchema }),
  cartController.removeItem,
);

module.exports = router;
