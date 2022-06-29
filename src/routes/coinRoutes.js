const coinController = require('../controllers/coinController');
const express = require('express');
const router = express.Router();

router.get('/coins', coinController.getAll);
router.post('/coins/buy', coinController.buyCoin);
router.post('/coins/sell', coinController.sellCoin);
router.post('/coins/swap', coinController.swapCoins);
router.post('/coins/deposit', coinController.deposit);
router.post('/coins/withdraw', coinController.withdraw);
router.post('/coins/sendToEmail', coinController.sendToEmail);

module.exports = router;