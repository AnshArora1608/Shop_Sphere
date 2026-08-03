const mongoose=require("mongoose");

const settingSchema=new mongoose.Schema({

    storeName:String,

    email:String,

    phone:String,

    address:String,

    logo:String,

    currency:{
        type:String,
        default:"INR"
    }

});

module.exports=mongoose.model("Setting",settingSchema);