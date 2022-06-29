const notificationController = require('../controllers/notificationController');
const express = require('express');
const router = express.Router();

router.get('/notifications', notificationController.getAll);
router.get('/notifications/mynotifications', notificationController.myNotifications);
router.post('/notifications', notificationController.addNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);
router.put('/notifications/markasseen/', notificationController.markAsSeen);
router.put('/notifications', notificationController.updateNotification);

module.exports = router;