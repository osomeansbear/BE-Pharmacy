const express = require("express");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

// Register user
router.post("/login", userController.loginUser);
router.post("/register", userController.register);

module.exports = router;
