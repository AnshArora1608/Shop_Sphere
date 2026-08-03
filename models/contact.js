const mongoose = require("mongoose");
const contactSchema=new mongoose.Schema({

    name:String,

    email:String,

    subject:String,

    message:String,

    read:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Contact", contactSchema);
