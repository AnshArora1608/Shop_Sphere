const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createToken } = require("../service/auth");

async function signupPage(req, res) {
    return res.render("user/signup");
}

async function signupUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.send("All fields are required");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });
        return res.render("user/login");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

async function loginPage(req, res) {
    return res.render("user/login");
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid Email");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.send("Incorrect Password");
        }

        const token = createToken(user);

        res.cookie("uid", token);

        return res.redirect("/");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}
async function profile(req, res) {

    const user = await User.findById(req.user.id);
    console.log(user)
    res.render("user/profile", {
        user,
    });

}

function logoutUser(req, res) {

    res.clearCookie("uid");

    res.redirect("/");

}

module.exports = {
    signupPage,
    signupUser,
    loginPage,
    loginUser,
    profile,
    logoutUser,
};