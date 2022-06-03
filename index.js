const express = require("express");
constexpress = require('express')
const app = express();

const { Coin,User, Wallet } = require('./src/db/models');

//http://localhost:5555/

//rutas
app.get('/', function (req,res) {
    res.send('hola')
})

app.get('/listusers', async function(req,res) {
	const users = await User.findAll();
    return res.send(users);
})

app.get('/listwallets', async function(req,res) {
	const wallets = await Wallet.findAll();
    return res.send(wallets);
})

app.get('/getoneuser', async function(req,res) {
	const user = await User.findByPk(2);
    return res.send(user);
})

// get user wallets 
app.get('/getonewallet', async function(req,res) {
	
    const john = await User.findByPk(2);
    const wallet = await john.getWallets();
    return res.send(wallet);

})

app.get('/listcoins', async function(req,res) {
	const coins = await Coin.findAll();
    return res.send(coins);
})



app.listen(5555);