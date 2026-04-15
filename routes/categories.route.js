const express = require("express");
const categoryController = require("../controllers/category.controller");
const validateData = require("../middlewares/validator.js");
const { verifyUser, verifyRoles } = require("../middlewares/authenticaton.js");
const {
  categoryIdParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/input/category.input.validator.js");

const router = express.Router();
const ADMIN = "ADMIN";

router.post(
  "/",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ body: createCategorySchema }),
  categoryController.createCategory,
);
router.get("/", categoryController.getAllCategories);
router.get(
  "/:id",
  validateData({ params: categoryIdParamsSchema }),
  categoryController.getCategoryById,
);
router.patch(
  "/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: categoryIdParamsSchema, body: updateCategorySchema }),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  verifyUser,
  verifyRoles([ADMIN]),
  validateData({ params: categoryIdParamsSchema }),
  categoryController.deleteCategory,
);

module.exports = router;
