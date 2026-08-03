const Wishlist = require("../models/wishlist");

async function addToWishlist(req, res) {

    try {

        const existing = await Wishlist.findOne({
            user: req.user.id,
            product: req.params.id,
        });

        if (!existing) {

            await Wishlist.create({
                user: req.user.id,
                product: req.params.id,
            });

        }

        res.redirect("/wishlist");

    } catch (err) {

        console.log(err);
        res.status(500).send("Internal Server Error");

    }

}

async function showWishlist(req, res) {

    try {

        const items = await Wishlist.find({
            user:req.user.id
        }).populate("product");

        res.render("wishlist",{
            items,
        });

    } catch(err){

        console.log(err);
        res.status(500).send("Internal Server Error");

    }

}

async function removeWishlist(req,res){

    try{

        await Wishlist.findByIdAndDelete(req.params.id);

        res.redirect("/wishlist");

    }catch(err){

        console.log(err);
        res.status(500).send("Internal Server Error");

    }

}

module.exports={
    addToWishlist,
    showWishlist,
    removeWishlist,
};