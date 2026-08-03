const express=require("express");

const router=express.Router();

const {checkAuth}=require("../middleware/auth");

const {addReview}=require("../controllers/review");

router.post("/:id",checkAuth,addReview);

module.exports=router;