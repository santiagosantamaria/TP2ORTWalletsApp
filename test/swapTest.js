const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;
const { Coin, User, Wallet} = require('../src/db/models');

 /* 
describe('Swap ', function () {
    it('Users Have to be 12', async function () {
        const users = await axios.get('http://localhost:5555/users/all');
        // console.log(users);
        assert.equal(users.data.length, 12);
    });
});
*/

describe('Swap 1 BTC por 12 ETH', function () {
    before('Comprando 1 btc', async () => {
        await axios({
            method: 'post',
            url: 'http://localhost:5555/coins/buy',
            data: {
                "tickerSearch": "BTC", 
                "quantity": 1
                },
        });

        let walletBalanceBtc = await axios({ //user 1 btc 
            method: 'get',
            url: 'http://localhost:5555/walletgetbalance/9',
        });


        let walletBalanceEth = await axios({ // user 1 eth
            method: 'get',
            url: 'http://localhost:5555/walletgetbalance/2',
        });

        
        //console.log(balanceWalletBtc);
    });
    
    it('Hago el swap', function (done) {
        axios({
            method: 'post',
            url: 'http://localhost:5555/coins/swap',
            data: {
                "tickerSell": "BTC", 
                "tickerBuy": "ETH", 
                "quantity": 1
            },
        }).then(res => {
            assert.equal(res.status,201);
            done();
        });
        
    });
});


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