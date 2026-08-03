const User = require("../models/User");
const { verifyToken } = require("../service/auth");

async function currentUser(req, res, next) {
    const token = req.cookies.uid;

    if (!token) {
        req.user = null;
        res.locals.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id);

        req.user = user;          
        res.locals.user = user;   // For EJS
    } catch (err) {
        req.user = null;
        res.locals.user = null;
    }

    next();
}

module.exports = currentUser;