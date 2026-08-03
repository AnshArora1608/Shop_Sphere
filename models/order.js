const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },


    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                default: 1,
            },

            price: {
                type: Number,
                required: true,
            },
        },
    ],


    totalPrice: {
        type: Number,
        required: true,
    },


    // Delivery Address
    shippingAddress: {

        name:{
            type:String,
            required:true
        },

        phone:{
            type:String,
            required:true
        },

        address:{
            type:String,
            required:true
        },

        city:{
            type:String,
            required:true
        },

        state:{
            type:String,
            required:true
        },

        pincode:{
            type:String,
            required:true
        }

    },


    // Coupon Details
    coupon:{

        code:{
            type:String,
            default:null
        },

        discount:{
            type:Number,
            default:0
        }

    },


    status: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled",
        ],
        default: "Pending",
    },


    paymentMethod: {
        type: String,
        enum: [
            "COD",
            "Online",
        ],
        default: "COD",
    },


    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Failed",
        ],
        default: "Pending",
    },


},
{
    timestamps:true,
}
);


module.exports = mongoose.model("Order", orderSchema);