const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {

    const token = req.cookies.uid;

    if (!token) {
        return res.redirect("/user/login");
    }

    try {

        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;

        next();

    } catch (err) {

        return res.redirect("/user/login");

    }

}

function admin(req, res, next) {

    if (req.user.role !== "ADMIN") {
        return res.status(403).send("Access Denied");
    }

    next();

}

module.exports = {
    checkAuth,
    admin
};