const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();


router.get('/users', userController.getAll);
router.get('/users/:id', userController.getUserById);
router.get('/users/findbyemail/:email', userController.findUserByEmail);
router.post('/users', userController.addUser);
router.put('/users', userController.editUser);
router.delete('/users', userController.deleteUser);
router.post('/users/login', userController.loginUser);
router.post('/users/logout', userController.logoutUser);
router.get('/users/getwallets', userController.getUserWallets);

module.exports = router;