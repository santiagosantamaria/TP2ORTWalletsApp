const cronBuyController = require('../controllers/cronBuyController');
const express = require('express');
const router = express.Router();

router.post('/cronbuys', cronBuyController.setCronBuy);
router.delete('/cronbuys', cronBuyController.deleteCronBuy);
router.put('/cronbuys', cronBuyController.updateCronBuy);
router.get('/cronbuys/run', cronBuyController.runCronBuy);

module.exports = router;