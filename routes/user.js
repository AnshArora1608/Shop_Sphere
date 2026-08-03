const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth");
const {
    signupPage,
    signupUser,
    loginPage,
    loginUser,
    profile,
    logoutUser,
} = require("../controllers/user");

router.get("/signup", signupPage);
router.post("/signup", signupUser);
router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/profile", checkAuth, profile);
router.get("/logout", logoutUser);

module.exports = router;