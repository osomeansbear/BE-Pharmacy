const express = require("express");
const orderController = require("../controllers/order.controller.js");
const validateData = require("../middlewares/validator.js");
const { verifyUser, verifyRoles } = require("../middlewares/authenticaton.js");
const {
  createOrderSchema,
  adminCreateOrderSchema,
  orderIdParamsSchema,
} = require("../validators/input/order.input.validator.js");
const {
  orderStatusParamsSchema,
  updateOrderStatusSchema,
} = require("../validators/input/order-status.input.validator.js");

const router = express.Router();

router.get(
  "/",
  verifyUser,
  verifyRoles(["ADMIN"]),
  orderController.getAllOrders,
);

router.get("/me", verifyUser, orderController.getMyOrders);

router.get(
  "/:id",
  verifyUser,
  validateData({ params: orderIdParamsSchema }),
  orderController.getMyOrderById,
);

router.patch(
  "/:id/cancel",
  verifyUser,
  validateData({ params: orderStatusParamsSchema }),
  orderController.cancelOrder,
);

router.post(
  "/admin-create",
  verifyUser,
  verifyRoles(["ADMIN"]),
  validateData({ body: adminCreateOrderSchema }),
  orderController.adminCreateOrder,
);

router.post(
  "/",
  verifyUser,
  validateData({ body: createOrderSchema }),
  orderController.createOrder,
);

router.patch(
  "/:id/status",
  verifyUser,
  verifyRoles(["ADMIN"]),
  validateData({
    params: orderStatusParamsSchema,
    body: updateOrderStatusSchema,
  }),
  orderController.updateOrderStatus,
);

module.exports = router;
