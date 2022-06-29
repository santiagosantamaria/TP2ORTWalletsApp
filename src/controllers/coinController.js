const { User, Coin, Wallet } = require('../db/models');

exports.getAll = async function(req, res) {
    try {
        const coins = await Coin.findAll();
        return res.send(coins);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
}

exports.buyCoin = async function(req, res) {
    const { tickerSearch, quantity } = req.body;

    let coinToBuy = await Coin.findOne({ where: { ticker: tickerSearch } });
    let coinUsdt = await Coin.findOne({ where: { ticker: 'USDT' } });
    let userIdBuscado = 1;


    try {
        const walletUsdt = await Wallet.findOne({ where: { userId: userIdBuscado, coinId: coinUsdt.id } });
        const walletCoin = await Wallet.findOne({ where: { userId: userIdBuscado, coinId: coinToBuy.id } });

        let netPrice = coinToBuy.unitDolarPrice * quantity;
        let resString = "";

        if (walletUsdt.balance >= netPrice) {

            walletUsdt.balance = walletUsdt.balance - netPrice;
            await walletUsdt.save();

            walletCoin.balance = walletCoin.balance + quantity;
            await walletCoin.save();

            resString = 'Compraste ' + quantity + ' ' + tickerSearch;
        } else {
            resString = 'No tienes suficiente dinero para comprar ' + quantity + ' ' + tickerSearch;
        }
        res.status(201).send(resString);

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }

};

exports.sellCoin = async function(req, res) {
    const { tickerSearch, quantity } = req.body;

    let coinToSell = await Coin.findOne({ where: { ticker: tickerSearch } });
    let coinUsdt = await Coin.findOne({ where: { ticker: 'USDT' } });
    let userIdBuscado = 1;

    try {
        const walletUsdt = await Wallet.findOne({ where: { userId: userIdBuscado, coinId: coinUsdt.id } });
        const walletCoin = await Wallet.findOne({ where: { userId: userIdBuscado, coinId: coinToSell.id } });

        let netPay = coinToSell.unitDolarPrice * quantity;
        let resString = "";

        if (walletCoin.balance >= quantity) {

            walletUsdt.balance = walletUsdt.balance + netPay;
            await walletUsdt.save();

            walletCoin.balance = walletCoin.balance - quantity;
            await walletCoin.save();

            resString = 'Vendiste ' + quantity + ' ' + tickerSearch + ' por ' + netPay + ' USDT';
        } else {
            resString = 'No tienes esa cantidad de ' + tickerSearch;
        }
        res.status(201).send(resString);

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }

};

exports.swapCoins = async function(req, res) {
    const { tickerSell, tickerBuy, quantity } = req.body;

    let coinToSell = await Coin.findOne({ where: { ticker: tickerSell } });
    let coinToBuy = await Coin.findOne({ where: { ticker: tickerBuy } });
    let userIdBuscado = 1;

    try {
        const walletSell = await Wallet.findOne({ where: { userId: userIdBuscado, coinId: coinToSell.id } });
        const walletBuy = await Wallet.findOne({ where: { userId: userIdBuscado, coinId: coinToBuy.id } });
        let resString = "";


        if (walletSell.balance >= quantity) {

            let netUsdt = quantity * coinToSell.unitDolarPrice;
            walletSell.balance = walletSell.balance - quantity;
            let quantityCoin = netUsdt / coinToBuy.unitDolarPrice;
            walletBuy.balance = walletBuy.balance + quantityCoin;

            await walletSell.save();
            await walletBuy.save();

            resString = 'Vendiste ' + quantity + ' ' + tickerSell + ' por ' + quantityCoin + tickerBuy;
        } else {
            resString = 'No tienes esa cantidad de ' + tickerSell;
        }
        res.status(201).send(resString);

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }

};

exports.deposit = async function(req, res) {
    const { adress, quantity } = req.body;
    let resString = "";

    try {
        let depositWallet = await Wallet.findOne({ where: { adress: adress } });

        if (depositWallet != null) {
            let depositCoin = await Coin.findOne({ where: { id: depositWallet.coinId } })

            depositWallet.balance += quantity;
            await depositWallet.save();

            resString = 'Depositaste ' + quantity + ' ' + depositCoin.ticker;
        } else {
            resString = 'No existe la wallet';
        }

        res.status(201).send(resString);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }

};

exports.withdraw = async function(req, res) {
    const { adress, ticker, quantity } = req.body;
    let resString = "";
    let userId = 1;

    try {
        let withdrawCoin = await Coin.findOne({ where: { ticker: ticker } })
        let withdrawWallet = await Wallet.findOne({ where: { coinId: withdrawCoin.id, userId: userId } });

        if (withdrawWallet != null && withdrawWallet.balance >= quantity) {
            withdrawWallet.balance -= quantity;
            await withdrawWallet.save();
            resString = 'Retiraste ' + quantity + ' ' + ticker + " a la direccion " + adress + ". Balance: " + withdrawWallet.balance;
        } else {
            resString = 'No tienes esa cantidad de ' + ticker;
        }

        res.status(201).send(resString);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }

};

exports.sendToEmail = async function(req, res) {
    const { email, ticker, quantity } = req.body;
    let userLoggedId = 1;

    try {

        let coin = await Coin.findOne({ where: { ticker: ticker } });
        let withdrawWallet = await Wallet.findOne({ where: { coinId: coin.id, userId: userLoggedId } });

        let userToSend = await User.findOne({ where: { email: email } });
        let userToSendWallet = await Wallet.findOne({ where: { coinId: coin.id, userId: userToSend.id } });

        if (withdrawWallet.balance >= quantity && userToSend != null) {

            withdrawWallet.balance = withdrawWallet.balance - quantity;
            userToSendWallet.balance = userToSendWallet.balance + quantity;

            await withdrawWallet.save();
            await userToSendWallet.save();

            var resString = 'Enviaste ' + quantity + ' ' + ticker + " a " + email + ". Balance: " + withdrawWallet.balance;

        } else {
            res.status(201).send("No se pudo realizar la operacion");
        }

        res.status(201).send(resString);

    } catch (err) {
        res.status(500).send(err.error);
    }

};

exports.getCoinIdByTicker = async function(ticker) {
    let coinSearchedByTicker = await Coin.findOne({ where: { ticker: ticker } });
    return coinSearchedByTicker.id;
}