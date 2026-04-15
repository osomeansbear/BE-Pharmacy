const express = require("express");
const productController = require("../controllers/product.controller");
const validateData = require("../middlewares/validator.js");
const { verifyUser, verifyRoles } = require("../middlewares/authenticaton.js");
const {
  assignProductCategorySchema,
  createProductDetailSchema,
  createProductSchema,
  createProductUnitSchema,
  productQuerySchema,
  productCategoryParamsSchema,
  productIdParamsSchema,
  productSlugParamsSchema,
  productUnitParamsSchema,
  updateProductDetailSchema,
  updateProductSchema,
  updateProductUnitSchema,
} = require("../validators/input/product.input.validator.js");

const router = express.Router();
const ADMIN = "ADMIN";

router.post(
  "/",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ body: createProductSchema }),
  productController.createProduct,
);
router.get(
  "/",
  validateData({ query: productQuerySchema }),
  productController.getAllProducts,
);
router.patch(
  "/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: productIdParamsSchema, body: updateProductSchema }),
  productController.updateProduct,
);
router.delete(
  "/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: productIdParamsSchema }),
  productController.deleteProduct,
);
router.post(
  "/:id/detail",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({
    params: productIdParamsSchema,
    body: createProductDetailSchema,
  }),
  productController.createDetail,
);
router.patch(
  "/:id/detail",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({
    params: productIdParamsSchema,
    body: updateProductDetailSchema,
  }),
  productController.updateDetail,
);
router.post(
  "/:id/units",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({
    params: productIdParamsSchema,
    body: createProductUnitSchema,
  }),
  productController.addUnit,
);
router.patch(
  "/:id/units/:unitId",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({
    params: productUnitParamsSchema,
    body: updateProductUnitSchema,
  }),
  productController.updateUnit,
);
router.delete(
  "/:id/units/:unitId",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: productUnitParamsSchema }),
  productController.deleteUnit,
);
router.post(
  "/:id/categories",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({
    params: productIdParamsSchema,
    body: assignProductCategorySchema,
  }),
  productController.assignCategory,
);
router.delete(
  "/:id/categories/:categoryId",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: productCategoryParamsSchema }),
  productController.removeCategory,
);
router.get(
  "/:slug",
  validateData({ params: productSlugParamsSchema }),
  productController.getProductDetail,
);

module.exports = router;
