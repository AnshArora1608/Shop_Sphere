const express = require("express");
const router = express.Router();

const { checkAuth } = require("../middleware/auth");

const {
    checkout,
    checkoutPage,
    showOrders,
    buyNow,
    placeOrder
} = require("../controllers/order");

router.get("/checkout",checkAuth,checkoutPage);

router.post("/checkout",checkAuth,checkout);

router.get("/",checkAuth,showOrders);

router.get("/buy-now/:id",checkAuth,buyNow);

router.post("/place-order",checkAuth,placeOrder);

module.exports = router;