const express = require("express");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

// Register user

router.delete("/delete/:id", userController.deleteUser);
router.patch("/update/:id", userController.updateUser);
router.get("/detail/:id", userController.getUserById);
router.get("/", userController.getAllUsers);
module.exports = router;
