const Review = require("../models/Review");

async function addReview(req,res){

    try{

        const {rating,comment}=req.body;

        await Review.findOneAndUpdate(

            {
                user:req.user.id,
                product:req.params.id,
            },

            {
                rating,
                comment,
            },

            {
                upsert:true,
                new:true,
            }

        );

        res.redirect("/products/"+req.params.id);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Internal Server Error");

    }

}

module.exports={
    addReview,
};