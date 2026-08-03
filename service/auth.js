const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        SECRET
    );
}

function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

module.exports = {
    createToken,
    verifyToken,
};