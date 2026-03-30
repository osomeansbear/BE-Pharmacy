const express = require("express");
const chatController = require("../controllers/chat.controller.js");
const validateData = require("../middlewares/validator.js");
const { optionalAuth } = require("../middlewares/optionalAuth.js");
const {
  chatMessageSchema,
} = require("../validators/input/chat.input.validator.js");

const router = express.Router();

// POST /api/v1/chat — works for both guests and authenticated users
router.post(
  "/",
  optionalAuth,
  validateData({ body: chatMessageSchema }),
  chatController.sendMessage,
);

module.exports = router;
