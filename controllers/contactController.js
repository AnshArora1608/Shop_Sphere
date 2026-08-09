const Contact = require("../models/contact");
const Notification = require("../models/notification");


async function saveContact(req, res) {
    try {
        const { name, email, subject, message } = req.body;
        // Save Contact Message
        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });
        // Create Admin Notification
        await Notification.create({
            title: "New Contact Message",
            message: `${name} sent a new message.`,
            type: "contact"
        });
        // console.log("Notification",Notification)
        res.redirect("/contact");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports = {
    saveContact
};