const { User, Coin, Wallet, Notification, Cronbuy, Transaction, Tag } = require('../db/models');
const moment = require('moment');

exports.setCronBuy = async function(req, res) {
    const { ticker, usdAmount, frequency } = req.body;
    let userId = 27;
    try {
        let coin = await Coin.findOne({ where: { ticker: ticker } });
        let coinId = coin.id;
        let cron = await Cronbuy.findOne({ where: { userId: userId, coinId: coinId } });

        if (cron) {
            try {
                await cron.update({
                    userId: userId,
                    coinId: coinId,
                    usdAmount: usdAmount,
                    frequency: frequency
                });
                res.status(201).send('Compra Recurrente Actualizada');
            } catch (err) {
                res.status(500).send('No se pudo realizar la operacion')
            }
        } else {
            let newCron = await Cronbuy.build({
                userId: userId,
                coinId: coinId,
                usdAmount: usdAmount,
                frequency: frequency,
                lastPurchaseDate: new Date()
            });
            newCron.save();
            res.status(201).send('Compra Recurrente Creada');
        }

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

exports.deleteCronBuy = async function(req, res) {
    const userId = 27;
    const ticker = req.params.ticker;
    try {
        let coin = await Coin.findOne({ where: { ticker: ticker } });
        let coinId = coin.id;
        await Cronbuy.destroy({
            where: { userId: userId, coinId: coinId }
        });
        res.status(201).send('Se Ha Eliminado La Compra Recurrente de ' + ticker);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

exports.updateCronBuy = async function(req, res) {
    const { ticker, usdAmount, frequency } = req.body;
    let userId = 27;

    try {

        let coin = await Coin.findOne({ where: { ticker: ticker } });
        let coinId = coin.id;

        let cron = await Cronbuy.findOne({ where: { userId: userId, coinId: coinId } });

        if (cron) {
            try {
                await cron.update({
                    userId: userId,
                    coinId: coinId,
                    usdAmount: usdAmount,
                    frequency: frequency
                });
                res.status(201).send('Compra Recurrente Actualizada');
            } catch (err) {
                res.status(500).send('No Tiene Compras Recurrentes de ' + ticker)
            }
        } else {

            res.status(500).send('No se pudo realizar la operacion');
        }

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

exports.runCronBuy = async function(req, res) {

    const cronBuys = await Cronbuy.findAll();
    let today = moment();
    try {
        for (const cron of cronBuys) {
            let diffDays = today.diff(cron.lastPurchaseDate, 'days');

            if (diffDays >= cron.frequency) {
                let coinToBuy = await Coin.findByPk(cron.coinId);

                let usdtCoin = await Coin.findOne({ where: { ticker: 'USDT' } });

                // User USD wallet
                let usdUserWallet = await Wallet.findOne({ where: { coinId: usdtCoin.id, userId: cron.userId } });
                // User XX Coin Wallet
                let coinUserWallet = await Wallet.findOne({ where: { coinId: cron.coinId, userId: cron.userId } });

                if (usdUserWallet.balance >= cron.usdAmount) {
                    usdUserWallet.balance = usdUserWallet.balance - cron.usdAmount;
                    await usdUserWallet.save();

                    // calculo de cantidad de moneda a comprar
                    let amtBuy = cron.usdAmount / coinToBuy.unitDolarPrice;


                    coinUserWallet.balance = coinUserWallet.balance + amtBuy;
                    await coinUserWallet.save();

                    await cron.update({
                        lastPurchaseDate: new Date()
                    });

                    await Notification.create({ title: "COMPRA RECURRENTE COMPLETADA", text: "COMPRASTE  " + cron.usdAmount + " de " + coinToBuy.ticker, userId: cron.userId, seen: 0 });
                    res.status(201).send('Cron Buys Ejecutado Ok');
                } else {
                    await Notification.create({ title: "COMPRA RECURRENTE FALLIDA", text: "No pudiste comprar  " + coinToBuy.ticker + " por saldo insuficiente", userId: cron.userId, seen: 0 });
                    res.status(501).send('Error en Cron buys');
                }
            }

        }
    } catch (e) {
        console.log(e.error);
        res.status(500).send('Error en Cron Buys');
    }
};