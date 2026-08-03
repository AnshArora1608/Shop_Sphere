const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const Review=require("../models/Review");
async function addProductPage(req, res) {
    res.render("admin/addProduct");
}
async function addProduct(req, res) {

    try {

        const {
            title,
            description,
            price,
            category,
            stock
        } = req.body;
        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "shopsphere_products"
            }
        );
        await Product.create({
            title,
            description,
            price,
            category,
            stock,
            imageURL: uploadResult.secure_url,
            createdBy: req.user.id
        });
        res.send("Product Added Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function showProducts(req, res) {
    try {
        const products = await Product.find();
        return res.render("home", {
            products,
            search: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}
async function showProductDetails(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render("productDetails", {
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function searchProducts(req, res) {
    try {
        const query = req.query.q;
        if (!query) {
            return res.redirect("/");
        }
        const products = await Product.find({
            $or: [
                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        });
        res.render("home", {
            products,
            search: query
        });
    } catch(error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function showCategory(req, res) {

    try {


        const products = await Product.find({

            category: req.params.category

        });



        res.render("home", {

            products,

            search: false

        });



    } catch (error) {


        console.log(error);


        res.status(500).send("Internal Server Error");


    }

}
async function showProductDetails(req, res) {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Related Products
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        // Reviews
        const reviews = await Review.find({
            product: product._id
        }).populate("user");

        // Average Rating
        let avgRating = 0;

        if (reviews.length > 0) {

            const total = reviews.reduce((sum, review) => {
                return sum + review.rating;
            }, 0);

            avgRating = total / reviews.length;
        }

        res.render("productDetails", {
            product,
            relatedProducts,
            reviews,
            avgRating
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {addProductPage,addProduct,showProducts,showProductDetails,searchProducts,showCategory};