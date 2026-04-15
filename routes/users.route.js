const express = require("express");
const userController = require("../controllers/user.controller.js");
const addressController = require("../controllers/address.controller.js");
const validateData = require("../middlewares/validator.js");
const { verifyUser, verifyRoles } = require("../middlewares/authenticaton.js");
const {
  addressIdParamsSchema,
  createAddressSchema,
  updateAddressSchema,
} = require("../validators/input/address.input.validator.js");
const {
  updateMeSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  updateUserSchema,
  userIdParamsSchema,
  changePasswordSchema,
} = require("../validators/input/user.input.validator.js");
const {
  healthProfileSchema,
} = require("../validators/input/health-profile.input.validator.js");

const router = express.Router();
const ADMIN = "ADMIN";

router.delete(
  "/delete/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: userIdParamsSchema }),
  userController.deleteUser,
);
router.patch(
  "/update/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: userIdParamsSchema, body: updateUserSchema }),
  userController.updateUser,
);
router.get("/profile", verifyUser, userController.getMe);
router.patch(
  "/profile",
  verifyUser,
  validateData({ body: updateMeSchema }),
  userController.updateMe,
);
router.patch(
  "/profile/password",
  verifyUser,
  validateData({ body: changePasswordSchema }),
  userController.changePassword,
);
router.get("/profile/health", verifyUser, userController.getHealthProfile);
router.put(
  "/profile/health",
  verifyUser,
  validateData({ body: healthProfileSchema }),
  userController.upsertHealthProfile,
);
router.get("/profile/addresses", verifyUser, addressController.getAddresses);
router.post(
  "/profile/addresses",
  verifyUser,
  validateData({ body: createAddressSchema }),
  addressController.createAddress,
);
router.patch(
  "/profile/addresses/:id",
  verifyUser,
  validateData({ params: addressIdParamsSchema, body: updateAddressSchema }),
  addressController.updateAddress,
);
router.delete(
  "/profile/addresses/:id",
  verifyUser,
  validateData({ params: addressIdParamsSchema }),
  addressController.deleteAddress,
);
router.get(
  "/detail/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: userIdParamsSchema }),
  userController.getUserById,
);
router.patch(
  "/:id/status",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: userIdParamsSchema, body: updateUserStatusSchema }),
  userController.updateStatus,
);
router.patch(
  "/:id/role",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: userIdParamsSchema, body: updateUserRoleSchema }),
  userController.updateRole,
);
router.get("/", verifyUser, verifyRoles([ADMIN]), userController.getAllUsers);
module.exports = router;
