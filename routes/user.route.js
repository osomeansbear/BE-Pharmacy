const express = require("express");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

// Register user
router.post("/register", userController.register);

module.exports = router;
