const Cart = require("../models/cart");

async function addToCart(req, res) {
    try {

        const userId = req.user.id;
        const productId = req.params.id;
        const existingItem = await Cart.findOne({
            user: userId,
            product: productId,
        });

        if (existingItem) {

            existingItem.quantity += 1;
            await existingItem.save();

            // console.log("Updated Existing Item");
            // console.log(existingItem);
        } else {
            const newItem = await Cart.create({
                user: userId,
                product: productId,
                quantity: 1,
            });
        }
        const allCartItems = await Cart.find();
        return res.redirect("/cart");

    } catch (error) {

        console.log(error);
        return res.status(500).send("Internal Server Error");

    }
}

async function showCart(req, res) {

    try {
        const allCartItems = await Cart.find().populate("product");

        // console.log("ALL CART ITEMS:");
        // console.log(allCartItems);

        const cartItems = await Cart.find({
            user: req.user.id,
        }).populate("product");


        return res.render("cart", {
            cartItems,
        });

    } catch (error) {

        console.log(error);
        return res.status(500).send("Internal Server Error");

    }
}

async function increaseQuantity(req, res) {

    try {

        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.send("Cart Item Not Found");
        }

        cartItem.quantity += 1;

        await cartItem.save();

        return res.redirect("/cart");

    } catch (error) {

        console.log(error);
        return res.status(500).send("Internal Server Error");

    }
}

async function decreaseQuantity(req, res) {

    try {

        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.send("Cart Item Not Found");
        }

        if (cartItem.quantity > 1) {

            cartItem.quantity -= 1;
            await cartItem.save();

        } else {

            await Cart.findByIdAndDelete(req.params.id);

        }

        return res.redirect("/cart");

    } catch (error) {

        console.log(error);
        return res.status(500).send("Internal Server Error");

    }
}

async function removeFromCart(req, res) {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        return res.redirect("/cart");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    addToCart,
    showCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
};