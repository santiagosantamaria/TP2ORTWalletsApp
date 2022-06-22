const walletController = require('../controllers/walletController');
const express = require('express');
const router = express.Router();

router.get('/wallets', walletController.getUserWallets);
router.get('/wallets/findbyemail/:email', walletController.findWalletsByUserEmail);
router.post('/wallets', walletController.addWalletForUser);
router.put('/wallets', walletController.editWallet);
router.delete('/wallets/:id', walletController.deleteWallet);






module.exports = router;