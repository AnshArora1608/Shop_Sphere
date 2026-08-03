const express = require("express");

const router = express.Router();

const { checkAuth } = require("../middleware/auth");

const {addToCart,showCart,increaseQuantity,decreaseQuantity,removeFromCart,} = require("../controllers/cart");

router.get("/",checkAuth,showCart);
router.post("/add/:id",checkAuth,addToCart);
router.post("/increase/:id", checkAuth, increaseQuantity);
router.post("/decrease/:id", checkAuth, decreaseQuantity);
router.post("/remove/:id",checkAuth,removeFromCart);

module.exports = router;