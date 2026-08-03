function checkAdmin(req, res, next) {
    if (req.user.role !== "ADMIN") {
        return res.status(403).send("Access Denied");
    }

    next();
}

module.exports = {
    checkAdmin,
};