const Notification = require("../models/notification");
const Contact = require("../models/contact");


async function adminData(req,res,next){

    try{

        res.locals.notifications = await Notification.find()
        .sort({createdAt:-1})
        .limit(5);


        res.locals.notificationCount = await Notification.countDocuments({
            read:false
        });



        res.locals.messages = await Contact.find()
        .sort({createdAt:-1})
        .limit(5);


        res.locals.messageCount = await Contact.countDocuments({
            read:false
        });


        next();


    }catch(err){

        console.log(err);
        next();

    }

}


module.exports = adminData;