const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;
const { Coin, User, Wallet, Notification, Admin, Cronbuy, Transaction } = require('../src/db/models');

 /* 
describe('Swap ', function () {
    it('Users Have to be 12', async function () {
        const users = await axios.get('http://localhost:5555/users/all');
        // console.log(users);
        assert.equal(users.data.length, 12);
    });
});
*/

describe('Swap', function () {

    let walletSell;
    let walletBuy;
    let balancePreSell;
    let balancePreBuy; 

    
    before('setup del swap 1 btc por 12 eth', async () => {  

        walletSell = await Wallet.findOne({ where: { userId:1, coinId:1}});
        walletBuy = await Wallet.findOne({ where: { userId:1, coinId:2}});

        balancePreSell = walletSell.balance;
        balancePreBuy = walletBuy.balance;


    });
    
    it('Swap 1 BTC por 12 ETH', function (done) {

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

        assert.equal(result, expectedResultETH, "test swap");
        done();

        });
        
    });
})


























/*
describe('Swap', function () {
    it('Swap 1 BTC por 12 ETH', async function () {

        let sellOk = false;
        let buyOk = false;

        //let coinToSell = await Coin.findOne({ where: { ticker:"BTC" }});
        //let coinToBuy = await Coin.findOne({ where: { ticker:"ETH" }});
        
        let walletSell = await Wallet.findOne({ where: { userId:1, coinId:1}});
        let walletBuy = await Wallet.findOne({ where: { userId:1, coinId:2 }});

        let balancePreSell = walletSell.balance;
        let balancePreBuy = walletBuy.balance;

        let res = await axios({   
            method: 'post',
            url: 'http://localhost:5555/coins/swap',
            data: {
                "tickerSell": "BTC", 
                "tickerBuy": "ETH", 
                "quantity": 1 
            },
        });
        
        
        let balancePostSell = walletSell.balance;
        let balancePostBuy = walletBuy.balance;
        
        console.log("------------------------------------------------------");
        
        console.log(balancePostSell === (balancePreSell - 1));

        if(balancePostSell === (balancePreSell - 1)){
             sellOk = true;
             
        };

        if(balancePostBuy === (balancePreBuy + 12)){
             buyOk = true;
        };

        

        if (sellOk && buyOk){
            assert.equal(res.status,201);
        } 

    });
})

describe('Swap', function () {
    it('Swap 1 BTC por 12 ETH RES STATUS 201', async function () {

        
        let res = await axios({   
            method: 'post',
            url: 'http://localhost:5555/coins/swap',
            data: {
                "tickerSell": "BTC", 
                "tickerBuy": "ETH", 
                "quantity": 1 
            },
        });

      assert.equal(res.status,201);
    });
});

*/