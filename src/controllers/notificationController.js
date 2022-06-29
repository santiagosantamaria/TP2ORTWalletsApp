const { User, Notification } = require('../db/models');

exports.getAll = async function(req, res) {
    try {
        let notifications = await Notification.findAll()
        return res.send(notifications)
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
};

exports.myNotifications = async function(req, res) {
    // should get user id from Authed user
    const userId = 1;

    try {
        const user = await User.findByPk(userId);
        const notification = await user.getNotifications();
        return res.send(notification)
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
};

exports.addNotification = async function(req, res) {
    const { title, text } = req.body;
    const userId = 27;

    try {
        let user = await User.findOne({ where: { id: userId } });
        if (user == null) {
            res.status(500).send('No se encontro a un usuario con ese id');
        } else {
            await Notification.create({ title: title, text: text, userId: userId, seen: 0 });
        }
        res.status(201).send('Notificacion Creada');

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
};

exports.deleteNotification = async function(req, res) {
    const notificationId = req.params.id;
    try {
        await Notification.destroy({
            where: { id: notificationId }
        });
        res.status(201).send('Notificacion Borrada del sistema');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

exports.markAsSeen = async function(req, res) {
    const notificationId = 13;

    try {
        await Notification.update({
            seen: 1
        }, {
            where: { id: notificationId }
        });
        res.status(201).send('Notificacion leida');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
};

exports.updateNotification = async function(req, res) {
    const { title, text } = req.body;
    const notificationId = 1;

    try {
        await Notification.update({
            title: title,
            text: text,
            seen: 0
        }, {
            where: { id: notificationId }
        });
        res.status(201).send('Notificacion Actualizada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
};