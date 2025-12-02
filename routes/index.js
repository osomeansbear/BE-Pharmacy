const express = require("express");
const userRoutes = require("./user.route.js");
const authRoutes = require("./auth.route.js");
const brandRoutes = require("./brand.route.js");
const categoryRoutes = require("./category.route.js");
const { verifyUser } = require("../middlewares/authenticaton.js");
const router = express.Router();

// All routes here
router.use("/auth", authRoutes);

// router.use(verifyUser);
router.use("/users", userRoutes);

// Brand routes
router.use("/brands", brandRoutes);

// Category routes
router.use("/categories", categoryRoutes);

module.exports = router;
