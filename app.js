require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const { checkAuth } = require("./Middleware/auth");

const app = express();
const PORT = process.env.PORT || 8000;
const currentUser = require("./Middleware/currentUser");
const cartCount = require("./middleware/cartCount");
const reviewRoute=require("./routes/review");
const adminRoute = require("./routes/admin");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const wishlistRoute = require("./routes/wishlist");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(currentUser);
app.use(express.static(path.resolve("./public")));

app.use(currentUser);
app.use(cartCount);

app.use("/review",reviewRoute);


app.use("/admin", adminRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
      console.log("MongoDB Connected");
      console.log("Current Database:", mongoose.connection.name);
  })
  .catch((err) => console.log(err));

app.use("/orders", orderRoute);

app.use("/", productRoute);


app.use("/cart", cartRoute);


app.use("/wishlist", wishlistRoute);

// User Routes
app.use("/user", userRoute);

// Protected Route
app.get("/profile", checkAuth, (req, res) => {
    res.send(`Welcome ${req.user.email}`);
});


app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});