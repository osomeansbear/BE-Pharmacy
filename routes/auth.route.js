const express = require("express");
const userController = require("../controllers/user.controller.js");
const validateData = require("../middlewares/validator.js");
const { createUserSchema } = require("../schemas/user.schema.js");
const router = express.Router();

// Register user
router.post("/login", userController.loginUser);
router.post(
  "/register",
  validateData({ body: createUserSchema }),
  userController.register
);

module.exports = router;
