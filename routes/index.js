const express = require("express");
const userRoutes = require("./user.route.js");

const router = express.Router();

// All routes here
router.use("/auth", userRoutes);

module.exports = router;
