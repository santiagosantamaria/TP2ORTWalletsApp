const { User, Coin, Wallet, Notification, Cronbuy, Transaction, Tag } = require('../db/models');

exports.getAllTransactions = async function(req, res) {
    try {
        let transactions = await Transaction.findAll();
        return res.send(transactions)
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }

};

exports.newTransaction = async function(req, res) {

    const { text } = req.body;
    const walletId = 5;
    try {
        let wallet = await Wallet.findOne({ where: { id: walletId } });


        if (wallet == null) {
            res.status(500).send('No se creo la transaccion ya que no existe esa wallet');
        } else {
            let newTransaction = await Transaction.create({ text: text, walletId: walletId })
        }
        res.status(201).send('Transaccion CREADA');

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
};

exports.updateTransaction = async function(req, res) {
    const { text } = req.body;
    const transactionId = 2;

    try {
        await Transaction.update({
            text: text,
        }, {
            where: { id: transactionId }
        });
        res.status(201).send('Transaccion Actualizada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
};

exports.deleteTransaction = async function(req, res) {
    const transactionId = req.params.id;
    try {
        await Transaction.destroy({
            where: { id: transactionId }
        });
        res.status(201).send('Transaccion Borrada del sistema');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};