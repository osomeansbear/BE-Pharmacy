const express = require("express");
const brandController = require("../controllers/brand.controller");

const router = express.Router();

// Create a new brand
router.post("/", brandController.createBrand);
router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);
router.patch("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

module.exports = router;
