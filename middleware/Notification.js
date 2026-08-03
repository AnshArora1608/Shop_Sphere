async function topbarData(req, res, next) {

    try {

        res.locals.notificationCount = await Notification.countDocuments({
            read: false
        });

        res.locals.messageCount = await Contact.countDocuments({
            read: false
        });

        res.locals.notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.locals.messages = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(5);

    } catch (err) {

        res.locals.notificationCount = 0;
        res.locals.messageCount = 0;
        res.locals.notifications = [];
        res.locals.messages = [];

    }

    next();
}

module.exports =topbarData;