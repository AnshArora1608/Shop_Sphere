const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const Notification = require("../models/notification");
const User = require("../models/user");

async function checkoutPage(req, res) {
    try {
        const cartItems = await Cart.find({
            user: req.user.id
        }).populate("product");

        if (cartItems.length === 0) {
            return res.send("Cart is Empty");
        }

        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        res.render("checkout", {cartItems,totalPrice});

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function checkout(req, res) {
    try {
        //cart
        const cartItems = await Cart.find({
            user: req.user.id
        }).populate("product");

        if (cartItems.length === 0) {
            return res.send("Cart is Empty");
        }
        const user = await User.findById(req.user.id);
        //user find
        if (!user) {
            return res.status(404).send("User not found");
        }
        //price
        let totalPrice = 0;

        const products = cartItems.map(item => {
            totalPrice += item.product.price * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            };
        });
        //order create
        await Order.create({
            user: req.user.id,
            products,
            totalPrice,
            shippingAddress: {
                name: user.name,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode
            },
            coupon: {
                code: req.body.coupon || null,
                discount: 0
            },
            paymentMethod: req.body.paymentMethod || "COD"
        });
        // quanity decrease
        for (let item of cartItems) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }
        // order already created than cart empty
        await Cart.deleteMany({
            user: req.user.id
        });
        // admin notification
        await Notification.create({
            title: "New Order Placed",
            message: "New order placed",
            type: "order"
        });

        res.redirect("/orders");

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function showOrders(req, res) {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).populate("products.product");

        res.render("orders", {
            orders
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function buyNow(req, res) {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("buyNowCheckout", {
            product
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function placeOrder(req, res) {
    try {
        const product = await Product.findById(req.body.productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // getting full user from DB
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send("User not found");
        }
        //order create    
        await Order.create({
            user: req.user.id,
            products: [
                {
                    product: product._id,
                    quantity: 1,
                    price: product.price
                }
            ],
            totalPrice: product.price,
            shippingAddress: {
                name: user.name,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode
            },
            paymentMethod: req.body.paymentMethod || "COD"
        });

        await Product.findByIdAndUpdate(
            product._id,
            {
                $inc: {
                    stock: -1
                }
            }
        );

        await Notification.create({
            title: "New Order Placed",
            message: "New order placed",
            type: "order"
        });

        res.redirect("/orders");

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    checkout,
    checkoutPage,
    showOrders,
    buyNow,
    placeOrder
};