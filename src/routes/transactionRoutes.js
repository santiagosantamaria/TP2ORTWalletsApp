const transactionController = require('../controllers/tranctionController');
const express = require('express');
const router = express.Router();


router.get('/transactions', transactionController.getAllTransactions);
router.post('/transactions', transactionController.newTransaction);
router.put('/transactions', transactionController.updateTransaction);
router.delete('/transactions', transactionController.deleteTransaction);

module.exports = router;