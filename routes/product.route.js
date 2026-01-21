const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

// Create a new product
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);

module.exports = router;
