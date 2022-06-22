const { User, Coin, Wallet, Notification, Cronbuy, Transaction, Tag } = require('../db/models');
const { randBitcoinAddress } = require('@ngneat/falso');
const wallet = require('../db/models/wallet');

exports.getUserWallets = async function(req, res) {
    try {
        const userId = 1;
        const user = await User.findByPk(userId);
        const wallet = await user.getWallets();
        res.status(201).send(wallet);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }

};

exports.findWalletsByUserEmail = async function(req, res) {
    try {
        const email = req.params.email;
        const user = await User.findOne({ where: { email: email } });

        if (user != null) {
            const wallet = await user.getWallets();
            res.status(201).send(wallet);
        }
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }

};

exports.addWalletForUser = async function(req, res) {
    const { coinId, userId, balance, adress } = req.body;
    try {
        let newWallet = await Wallet.build({
            coinId: coinId,
            userId: userId,
            balance: balance,
            adress: adress,
        });
        newWallet.save();
        res.status(201).send('Wallet Registrada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
}

exports.editWallet = async function(req, res) {
    const { coinId, balance, adress } = req.body;
    let userId = 14;
    const walletId = req.params.id;
    try {
        await Wallet.update({
            coinId: coinId,
            userId: userId,
            balance: balance,
            adress: adress,
        }, {
            where: { id: walletId }
        });
        res.status(201).send('Wallet Actualizada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
}

exports.deleteWallet = async function(req, res) {
    const walletId = req.params.id;
    try {
        await Wallet.destroy({
            where: { id: walletId }
        });
        res.status(201).send('Wallet Borrada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
}