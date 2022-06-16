const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;
const { Coin, User, Wallet, Notification, Admin, Cronbuy, Transaction } = require('../src/db/models');


describe('Swap con saldo', function () {

    let walletSell;
    let walletBuy;
    let balancePreSell;
    let balancePreBuy; 

    
    before('setup del swap 1 btc por 12 eth con saldo', async () => {  

        walletSell = await Wallet.findOne({ where: { userId:1, coinId:1}});
        walletBuy = await Wallet.findOne({ where: { userId:1, coinId:2}});

        walletSell.balance = 1;
        await walletSell.save();

        balancePreSell = walletSell.balance;
        balancePreBuy = walletBuy.balance;


    });
    
    it('Swap 1 BTC por 12 ETH con saldo', function (done) {

        let res = axios({   
            method: 'post',
            url: 'http://localhost:5555/coins/swap',
            data: {
                "tickerSell": "BTC", 
                "tickerBuy": "ETH", 
                "quantity": 1 
            },
        }).then(async function(resolve){

        let expectedResultETH = balancePreBuy + 12;
        let waletResultETH = await Wallet.findOne({ where: { userId:1, coinId:2 }});
        let result = await waletResultETH.balance; 

        assert.equal(result, expectedResultETH, "test swap"); // espera +12 eth
        done();

        });
        
    });
})



describe('Swap sin saldo', function () {

    let walletSell;
    let walletBuy;
    let balancePreSell;
    let balancePreBuy; 

    
    before('setup del swap 1 btc por 12 eth sin saldo', async () => {  

        walletSell = await Wallet.findOne({ where: { userId:1, coinId:1}});
        walletBuy = await Wallet.findOne({ where: { userId:1, coinId:2}});

        walletSell.balance = 0;
        await walletSell.save();

        balancePreSell = walletSell.balance;
        balancePreBuy = walletBuy.balance;


    });
    
    it('Swap 1 BTC por 12 ETH sin saldo', function (done) {

        let res = axios({   
            method: 'post',
            url: 'http://localhost:5555/coins/swap',
            data: {
                "tickerSell": "BTC", 
                "tickerBuy": "ETH", 
                "quantity": 1 
            },
        }).then(async function(resolve){

        let expectedResultETH = balancePreBuy
        let waletResultETH = await Wallet.findOne({ where: { userId:1, coinId:2 }});
        let result = await waletResultETH.balance; 

        assert.equal(result, expectedResultETH, "test swap"); //espera mismo balance que antes 
        done();

        });
        
    });
})






















