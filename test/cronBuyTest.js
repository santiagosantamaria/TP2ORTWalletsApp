const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');

const { DESCRIBE } = require('sequelize');
const { assert } = chai;
const { Coin, User, Wallet, Notification, Admin, Cronbuy, Transaction } = require('../src/db/models');


//testeo la respuesta http. Funciona genial pero no veo si realiza cambios o no.
describe('CronBuy', function (done) {
    it('CronBuys Runs OK', async function () {
        axios({
            method: 'get',
            url: 'http://localhost:5555/cronbuys/run',
        }).then(res => {
            assert.equal(res.status,201);
            done();
        });
    });
})



// CronBuy a un usuario con suficiente plata modifica el balance.
describe('CronBuy2: CronBuy a un usuario con suficiente plata modifica el balance.', function () {
    let walletBTC;
    let walletUSDT;
    before('setup del cronbuy 2', async () => {

        //Creo una cron buy para el test (este metodo tiene hardcodeado el id del usuario 27)
        await axios({
            method: 'post',
            url: 'http://localhost:5555/cronbuys',
            data: {
                "ticker":"BTC",
                "usdAmount":3333,
                "frequency":1
            }
        });

        //obtengo el cronbuy de prueba
        let cron = await Cronbuy.findOne({ where: {coinId: 1, userId: 27 } } );

        //le cambio la fecha para garantizar que se ejecute
        cron.lastPurchaseDate = new Date(2021,5,5);

        await cron.save();

       //agarro la wallet de btc y la seteo en cero
        walletBTC = await Wallet.findOne({where: {coinId: 1, userId: 27}})
        walletBTC.balance = 0;
        await walletBTC.save();

        //agarro la de USDT
        // le pongo 1 millon
        walletUSDT = await Wallet.findOne({where: {coinId: 4, userId: 27}})
        walletUSDT.balance = 9999;
        await walletUSDT.save();

    });

    //ejecuto las cronbuy
    it('Cronbuy2: ejecutar cronbuy',  function (done) {
        axios({
            method: 'get',
            url: 'http://localhost:5555/cronbuys/run',
        }).then(async function(resolve){
            walletBTC = await Wallet.findOne({where: {coinId: 1, userId: 27}})
            walletUSDT = await Wallet.findOne({where: {coinId: 4, userId: 27}})

            await walletBTC.save();
            await walletUSDT.save();

            console.log("WALLET BTC: balance " + walletBTC.balance + " userId " + walletBTC.userId + " coinId " + walletBTC.coinId)
            console.log("WALLET USDT: balance " + walletUSDT.balance + " userId " + walletUSDT.userId + " coinId " + walletUSDT.coinId)

            let balanceResult = walletBTC.balance;
            let result = 0.1111;

            assert.equal(balanceResult, result, 'balance equal result')

            done();


        });
    });
})

// CronBuy a un usuario sin suficiente plata no modifica el balance.
describe('CronBuy3: CronBuy a un usuario sin suficiente plata no modifica el balance.', function () {
    let walletBTC;
    let walletUSDT;
    before('setup del cronbuy 3', async () => {

        //Creo una cron buy para el test (este metodo tiene hardcodeado el id del usuario 27)
        await axios({
            method: 'post',
            url: 'http://localhost:5555/cronbuys',
            data: {
                "ticker":"BTC",
                "usdAmount":3333,
                "frequency":1
            }
        });

        //obtengo el cronbuy de prueba
        let cron = await Cronbuy.findOne({ where: {coinId: 1, userId: 27 } } );

        //le cambio la fecha para garantizar que se ejecute
        cron.lastPurchaseDate = new Date(2021,5,5);

        await cron.save();

        //agarro la wallet de btc y la seteo en cero
        walletBTC = await Wallet.findOne({where: {coinId: 1, userId: 27}})
        walletBTC.balance = 0;
        await walletBTC.save();

        //agarro la de USDT y la seteo en 0 tambien (para que no pueda realizar la compra por saldo insuficiente)
        walletUSDT = await Wallet.findOne({where: {coinId: 4, userId: 27}})
        walletUSDT.balance = 0;
        await walletUSDT.save();

    });

    //ejecuto las cronbuy
    it('Cronbuy3: ejecutar cronbuy',  function (done) {
        axios({
            method: 'get',
            url: 'http://localhost:5555/cronbuys/run',
        }).then(async function(resolve){
            walletBTC = await Wallet.findOne({where: {coinId: 1, userId: 27}})
            walletUSDT = await Wallet.findOne({where: {coinId: 4, userId: 27}})

            await walletBTC.save();
            await walletUSDT.save();

            console.log("WALLET BTC: balance " + walletBTC.balance + " userId " + walletBTC.userId + " coinId " + walletBTC.coinId)
            console.log("WALLET USDT: balance " + walletUSDT.balance + " userId " + walletUSDT.userId + " coinId " + walletUSDT.coinId)

            let balanceResult = walletBTC.balance;
            let result = 0;

            assert.equal(balanceResult, result, 'balance equal result')

            done();


        });
    });
})

