const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;
const { Coin, User, Wallet, Notification, Admin, Cronbuy, Transaction } = require('../src/db/models');


describe('CronBuy', function () {
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

//hacer un test para la creacion
//hacer un test para la notificacion

//TEST 2

describe('CronBuy2', function () {
    before('Set up new user and new cronbuy', async () => {

        await axios({
            method: 'post',
            url: 'http://localhost:5555/users',
            data: {
                firstName: "Tony",
                lastName: "Krons",
                email: "tonykrons@realmadrid.com",
                password: "12345"
            },
        })

        let user = await axios({
            method: 'get',
            url: 'http://localhost:5555/users/findbyemail/tonykrons@realmadrid.com'
        });

        //todo como le mando un cronbuy al usuario de arriba si no recibe parametros ya que el id esta hardcodeado
        await axios({
            method: 'post',
            url: 'http://localhost:5555/cronbuys',
            data: {
                "ticker":"BTC",
                "usdAmount":9999,
                "frequency":1
            }
        });
    });

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

//TESTEAR LA CREACION DEL CRONBUY?


/*
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
 */