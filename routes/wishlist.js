const express = require("express");
const router = express.Router();

const { checkAuth } = require("../middleware/auth");

const {
    addToWishlist,
    showWishlist,
    removeWishlist,
} = require("../controllers/wishlist");

router.post("/add/:id", checkAuth, addToWishlist);

router.get("/", checkAuth, showWishlist);

router.post("/remove/:id", checkAuth, removeWishlist);

module.exports = router;