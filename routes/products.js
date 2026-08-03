const express = require("express");
const router = express.Router();

const {
    showProducts,
    showProductDetails,
    searchProducts,
    showCategory,
} = require("../controllers/product");

router.get("/", showProducts);
router.get("/products/:id", showProductDetails);
router.get("/search",searchProducts);
router.get("/category/:category",showCategory);

module.exports = router;