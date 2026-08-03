const Cart = require("../models/cart");

async function cartCount(req,res,next){

    if(req.user){

        const count = await Cart.countDocuments({
            user:req.user.id
        });

        res.locals.cartCount = count;

    }
    else{
        res.locals.cartCount = 0;
    }

    next();

}


module.exports = cartCount;