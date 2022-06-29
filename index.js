const express = require('express');
const { randBitcoinAddress } = require('@ngneat/falso');
const moment = require('moment');
const app = express();
app.use(express.urlencoded({ extended: true }));

// accept json in post request
app.use(express.json());
const res = require('express/lib/response');

const { Coin, Wallet, Notification, Admin, Cronbuy, Transaction, Tag } = require('./src/db/models');

//http://localhost:5555/

//rutas 
app.get('/', function(req, res) {
    res.send('hola')
})

// User Routes
const userRouter = require("./src/routes/userRoutes");
app.get('/users', userRouter);
app.get("/users/:id", userRouter);
app.get("/users/findbyemail/:email", userRouter);
app.post('/users', userRouter);
app.put('/users', userRouter);
app.delete('/users', userRouter);
app.post('/users/login', userRouter);
app.post('/users/logout', userRouter);
app.get('/users/getwallets', userRouter);

// Wallet Routes
const walletRouter = require('./src/routes/walletRoutes');
app.get('/wallets', walletRouter);
app.get('/wallets/findbyemail/:email', walletRouter);
app.post('/wallets', walletRouter);
app.put('/wallets', walletRouter);
app.delete('/wallets/:id', walletRouter);

// Coin Routes
const coinRouter = require('./src/routes/coinRoutes');
app.get('/coins', coinRouter);
app.post('/coins/buy', coinRouter);
app.post('/coins/sell', coinRouter);
app.post('/coins/swap', coinRouter);
app.post('/coins/deposit', coinRouter);
app.post('/coins/withdraw', coinRouter);
app.post('/coins/sendToEmail', coinRouter);

// Notification Routes
const notificationRouter = require('./src/routes/notificationRoutes');
app.get('/notifications', notificationRouter);
app.get('/notifications/mynotifications', notificationRouter);
app.post('/notifications', notificationRouter);
app.delete('/notifications/:id', notificationRouter);
app.put('/notifications/markasseen/', notificationRouter);
app.put('/notifications', notificationRouter);


//LIST ALL TRANSACTIONS
app.get('/transactions', async function(req, res) {
    try {
        let transactions = await Transaction.findAll();
        return res.send(transactions)
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }

})

//nueva transaccion (log)
// sending params via post json
app.post('/transactions', async function(req, res) {

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
})



//actualizar transaccion (log)
//actualizar una notificacion
app.put('/transactions', async function(req, res) {
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
})

//eliminar transaccion
app.delete('/transactions/:id', async function(req, res) {
    const transactionId = req.params.id;
    try {
        await Transaction.destroy({
            where: { id: transactionId }
        });
        res.status(201).send('Transaccion Borrada del sistema');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})



//---------------------------------------END TRANSACTIONS-----------------------------------

/* METODOS JS -----------------------------------------------------------------------------------------------*/

const getCoinIdByTicker = async function(ticker) {

    let coinSearchedByTicker = await Coin.findOne({ where: { ticker: ticker } });

    return coinSearchedByTicker.id;
}


// ---- CRON BUYs -------------------------------

// set a cron buy for a user
app.post('/cronbuys', async function(req, res) {
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
})

// delete a cron buy for a user
app.delete('/cronbuys/:ticker', async function(req, res) {
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
})

// modify $usd Amount or frequency (days) for a cron buy
app.put('/cronbuys', async function(req, res) {
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
})

// run the cron buy
async function runCronBuys() {

    const cronBuys = await Cronbuy.findAll();
    let today = moment();
    try {
        for (const cron of cronBuys) {
            let diffDays = today.diff(cron.lastPurchaseDate, 'days');


            console.log(" -------DIFF DAYS --------" + diffDays)
            console.log(" -------crons frecuency --------" + cron.frequency)
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

                    // emitir notificacion a usuario // compra recurrente de X coin
                    console.log('User id: ' + cron.userId + ' compro ' + cron.usdAmount + ' de ' + coinToBuy.ticker);
                    await Notification.create({ title: "COMPRA RECURRENTE COMPLETADA", text: "COMPRASTE  " + cron.usdAmount + " de " + coinToBuy.ticker, userId: cron.userId, seen: 0 })
                } else {
                    console.log("ENTRE AL ELSE")
                    await Notification.create({ title: "COMPRA RECURRENTE FALLIDA", text: "No pudiste comprar  " + coinToBuy.ticker + " por saldo insuficiente", userId: cron.userId, seen: 0 })
                }
            }

        }
    } catch (e) {
        console.log(e.error);
        res.status(500).send('Error en Cron Buys');
    }
}

// probando cron buy / seria un cron job del servidor en realidad
app.get('/cronbuys/run', async function(req, res) {
    try {
        await runCronBuys();
        res.status(201).send('Cron Buys Ejecutado Ok');
    } catch (e) {
        res.status(501).send('Error en Cron buys');
    }
});


// ---- END CRON BUY -------------------------------

/* ---- BEGIN TAG -------------------------------------------------------- */

app.get('/listtags', async function(req, res) {
    const tag = await Tag.findAll();
    return res.send(tag);
})

app.get('/tags/find/:id', async function(req, res) {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    if (tag != null) {
        return res.status(201).send(tag);
    } else {
        return res.status(501)
    }
})

/* add tag */
app.post('/tags/new', async function(req, res) {
    const { name, coinId } = req.body;
    try {
        let newTag = await Tag.build({
            name: name,
            coinId: coinId,
        });
        newTag.save();
        res.status(201).send('Tag Registrada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

app.put('/tags/update/:id', async function(req, res) {
    const { name, coinId } = req.body;
    const tagId = req.params.id;
    try {
        await Tag.update({
            name: name,
            coinId: coinId,
        }, {
            where: { id: tagId }
        });
        res.status(201).send('Tag Actualizada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

app.delete('/tags/delete/:id', async function(req, res) {
    const tagId = req.params.id;
    try {
        await Tag.destroy({
            where: { id: tagId }
        });
        res.status(201).send('Tag eliminada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

app.get('/tagsfrom/coin/:id', async function(req, res) {
    const _coinId = req.params.id;
    const coin = await Coin.findByPk(_coinId);
    const coinName = coin.name;

    const tagsFromCoin = await Tag.findAll({
        attributes: ["name"],
        raw: true,
        where: { coinId: _coinId }
    });

    const cantTagsForCoin = tagsFromCoin.length
        //const tagsNames = JSON.stringify(tagsFromCoin);

    let i = 0;
    let returnTagsAndCoins = ""

    returnTagsAndCoins = coinName;

    while (i < cantTagsForCoin) {

        const nameTagi = tagsFromCoin[i].name;
        returnTagsAndCoins = returnTagsAndCoins + ",  " + nameTagi;
        i = i + 1;
    }

    //console.log(returnTagsAndCoins);
    return res.status(201).send(returnTagsAndCoins);
})



// ---- END TAGS -------------------------------


app.listen(5555);