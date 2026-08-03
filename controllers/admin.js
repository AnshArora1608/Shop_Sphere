const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");
const Setting=require("../models/Setting");
const  Notification = require("../models/notification");
const  Contact = require("../models/contact");

const cloudinary = require("../config/cloudinary");

// ================= Dashboard =================
async function dashboard(req,res){
try{
const totalProducts=await Product.countDocuments();
const totalUsers=await User.countDocuments();
const totalOrders=await Order.countDocuments();
const totalReviews=await Review.countDocuments();

const orders=await Order.find()
.populate("user")
.sort({createdAt:-1});

let revenue=0;

orders.forEach(order=>{
revenue+=order.totalPrice;
});

res.render("admin/dashboard",{
totalProducts,
totalUsers,
totalOrders,
totalReviews,
revenue,
orders
});

}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
// ================= Products =================
async function allProducts(req,res){
try{
const products=await Product.find().sort({createdAt:-1});
res.render("admin/products",{products});
}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
async function deleteProduct(req,res){
try{
await Product.findByIdAndDelete(req.params.id);
res.redirect("/admin/products");
}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
// ================= Orders =================
async function allOrders(req,res){
try{
const orders=await Order.find()
.populate("user")
.populate("products.product")
.sort({createdAt:-1});

res.render("admin/orders",{
orders
});

}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
async function updateOrderStatus(req,res){
try{
await Order.findByIdAndUpdate(
req.params.id,
{
status:req.body.status
}
);
res.redirect("/admin/orders");
}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
// ================= Users =================
async function allUsers(req,res){
try{
const users=await User.find().sort({createdAt:-1});
res.render("admin/users",{users});
}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
async function deleteUser(req,res){
try{
await User.findByIdAndDelete(req.params.id);
res.redirect("/admin/users");
}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
// ================= Reviews =================
async function allReviews(req,res){
try{
const reviews=await Review.find()
.populate("user")
.populate("product")
.sort({createdAt:-1});

res.render("admin/reviews",{
reviews
});

}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
async function deleteReview(req,res){
try{
await Review.findByIdAndDelete(req.params.id);
res.redirect("/admin/reviews");
}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
// ================= Analytics =================
async function analytics(req,res){
try{
const totalProducts=await Product.countDocuments();
const totalUsers=await User.countDocuments();
const totalOrders=await Order.countDocuments();
const totalReviews=await Review.countDocuments();

const orders=await Order.find();

let revenue=0;
let monthlyRevenue=new Array(12).fill(0);
let statusData=[0,0,0,0];

orders.forEach(order=>{
revenue+=order.totalPrice;

const month=new Date(order.createdAt).getMonth();
monthlyRevenue[month]+=order.totalPrice;

if(order.status==="Pending") statusData[0]++;
else if(order.status==="Shipped") statusData[1]++;
else if(order.status==="Delivered") statusData[2]++;
else statusData[3]++;
});

res.render("admin/analytics",{
totalProducts,
totalUsers,
totalOrders,
totalReviews,
revenue,
monthlyRevenue,
statusData
});

}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
// ================= Edit Product =================
async function editProductPage(req,res){
try{
const product=await Product.findById(req.params.id);

if(!product){
return res.redirect("/admin/products");
}

res.render("admin/editProduct",{
product
});

}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
async function updateProduct(req,res){
try{

const {title,description,category,price,stock}=req.body;

const product=await Product.findById(req.params.id);

if(!product){
return res.redirect("/admin/products");
}

if(req.file){
const uploadResult=await cloudinary.uploader.upload(
`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
{
folder:"shopsphere_products"
}
);

product.imageURL=uploadResult.secure_url;
}

product.title=title;
product.description=description;
product.category=category;
product.price=price;
product.stock=stock;

await product.save();

res.redirect("/admin/products");

}catch(err){
console.log(err);
res.status(500).send("Internal Server Error");
}
}
async function settingsPage(req,res){

    let setting=await Setting.findOne();

    if(!setting){

        setting=await Setting.create({

            storeName:"ShopSphere"

        });

    }

    res.render("admin/settings",{

        setting

    });

}
async function updateSettings(req,res){

    await Setting.findOneAndUpdate({},req.body);

    res.redirect("/admin/settings");

}

async function adminSearch(req, res){

    const search = req.query.search || "";

    console.log("SEARCH:", search);


    const users = await User.find({
        $or:[
            {
                name:{
                    $regex: search,
                    $options:"i"
                }
            },
            {
                email:{
                    $regex: search,
                    $options:"i"
                }
            }
        ]
    });


    const products = await Product.find({
        $or:[
            {
                title:{
                    $regex: search,
                    $options:"i"
                }
            },
            {
                category:{
                    $regex: search,
                    $options:"i"
                }
            }
        ]
    });


    console.log("USERS:", users.length);
    console.log("PRODUCTS:", products.length);


    res.render("admin/search",{
        query: search,
        users,
        products
    });

}
// ================= CONTACT =================

async function saveContact(req, res) {
    try {

        const { name, email, subject, message } = req.body;

        await Contact.create({
            name,
            email,
            subject,
            message
        });

        await Notification.create({
            title: "New Contact Message",
            message: `${name} sent a new message.`
        });

        res.redirect("/contact");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
async function getNotifications(req, res) {

    try {

        const notifications = await Notification.find()
            .sort({ createdAt: -1 });
        console.log(notifications)
        res.render("admin/notifications", {
            notifications
        });

    } catch (err) {

        console.log(err);
        res.redirect("/admin/dashboard");

    }

}
async function getMessages(req, res) {

    try {

        const messages = await Contact.find()
            .sort({ createdAt: -1 });

        res.render("admin/messages", {
            messages
        });

    } catch (err) {

        console.log(err);
        res.redirect("/admin/dashboard");

    }

}
async function markNotificationRead(req, res) {

    try {

        await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true }
        );

        res.redirect("/admin/notifications");

    } catch (err) {

        console.log(err);
        res.redirect("/admin/notifications");

    }

}
async function markMessageRead(req, res) {

    try {

        await Contact.findByIdAndUpdate(
            req.params.id,
            { read: true }
        );

        res.redirect("/admin/messages");

    } catch (err) {

        console.log(err);
        res.redirect("/admin/messages");

    }

}





module.exports={
dashboard,
allProducts,
deleteProduct,
allOrders,
updateOrderStatus,
allUsers,
deleteUser,
allReviews,
deleteReview,
analytics,
editProductPage,
updateProduct,
settingsPage,
updateSettings,
adminSearch,
saveContact,
getNotifications,
getMessages,
markNotificationRead,
markMessageRead
};