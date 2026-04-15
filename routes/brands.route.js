const express = require("express");
const brandController = require("../controllers/brand.controller");
const validateData = require("../middlewares/validator.js");
const { verifyUser, verifyRoles } = require("../middlewares/authenticaton.js");
const {
  brandIdParamsSchema,
  createBrandSchema,
  updateBrandSchema,
} = require("../validators/input/brand.input.validator.js");

const router = express.Router();
const ADMIN = "ADMIN";

router.post(
  "/",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ body: createBrandSchema }),
  brandController.createBrand,
);
router.get("/", brandController.getAllBrands);
router.get(
  "/:id",
  validateData({ params: brandIdParamsSchema }),
  brandController.getBrandById,
);
router.patch(
  "/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: brandIdParamsSchema, body: updateBrandSchema }),
  brandController.updateBrand,
);
router.delete(
  "/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: brandIdParamsSchema }),
  brandController.deleteBrand,
);

module.exports = router;
