const express = require("express");
const adminController = require("../controllers/admin.controller.js");
const { verifyUser, verifyRoles } = require("../middlewares/authenticaton.js");

const router = express.Router();

router.get(
  "/stats",
  verifyUser,
  verifyRoles(["ADMIN"]),
  adminController.getStats,
);

module.exports = router;
