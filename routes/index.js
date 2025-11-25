const express = require("express");
const userRoutes = require("./user.route.js");
const authRoutes = require("./auth.route.js");
const { verifyUser } = require("../middlewares/authenticaton.js");
const router = express.Router();

// All routes here
router.use("/auth", authRoutes);

// router.use(verifyUser);
router.use("/users", userRoutes);

module.exports = router;
