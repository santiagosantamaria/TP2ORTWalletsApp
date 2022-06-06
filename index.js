const express = require("express");
const session = require('express-session');
const { randBitcoinAddress } = require('@ngneat/falso');
constexpress= require('express')

const app =express();


// accept json in post request
app.use(express.json());
app.use(
    session({
        secret:"Secret_Key",
        resave:false,
        saveUninitialized: false
    })
)

const isAuth = (req,res,next) => {
    if(req.session.isAuth) {
        next()
    } else {
        res.status(500).send('Usuario No Logueado')
    }
}

const { Coin, User, Wallet, Notification } = require('./src/db/models');

//http://localhost:5555/

//rutas
app.get('/', function (req,res) {
    res.send('hola')
})


// get user wallets

app.get('/listcoins', async function(req,res) {
	const coins = await Coin.findAll();
    return res.send(coins);
})


/* ---- BEGIN USERS -------------------------------------------------------- */

app.get('/users/all', async function(req,res) {
	const users = await User.findAll();
    return res.send(users);
})

app.get('/users/find/:id', async function(req,res) {
	const userId = req.params.id;
    const user = await User.findByPk(userId);
    return res.send(user);
})

// sending params via post json
app.post('/users/register', async function(req,res) {
    const { firstName, lastName, email, password } = req.body;
    console.log(email)
    try {
        let user = await User.findOne({ where:{ email:email }});

        if(user) {
            res.status(201).send('Ya existe un usuario con ese email');
         } else {
            let newUser = await User.build({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
              });

            newUser.save().then(async function() {
                let user = await User.findOne({ where:{ email:email }});
                let userId = user.id;
                let allCoins = await Coin.findAll();
                // creating an empty wallet for the User, with every Coin
                allCoins.forEach(
                    (coin) => {
                      let tableCoinId = coin.dataValues.id;
                      let newWallet = Wallet.build({
                        coinId: tableCoinId,
                        userId: userId,
                        balance: 0,
                        adress: randBitcoinAddress(),
                      });
                      newWallet.save();
                    }
                  );

            });

            res.status(201).send('Usuario Creado');
         }

    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

// update a user
app.put('/users/update/:id', async function(req,res) {
    const { firstName, lastName, email, password } = req.body;
    const userId = req.params.id;
    try {
        await User.update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
          },{
              where:{ id:userId }
            });
        res.status(201).send('Usuario Actualizado');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

// delete a user by id // asociations not checked
app.delete('/users/delete/:id', async function(req,res) {
    const userId = req.params.id;
    try {
        await User.destroy({
              where:{ id:userId }
            });
        res.status(201).send('Usuario Borrado');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

// login with email and password
app.post('/users/login', async function(req,res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email, password }})

        if( user == null) {
            return res.status(400).send('Usuario no encontrado');
        }

        req.session.isAuth = true;
        req.session.userId = user.id;

        res.status(201).send('Login Ok');

        } catch (error) {
            res.status(500).send();
        }
})

app.post('/users/logout', async function(req,res) {
    req.session.isAuth = false;
    req.session.userId = null;
    res.status(201).send('Logout Ok');
})

/*list user wallets*/
app.get('/listUserWallets', isAuth, async function(req,res) {
	const userId = req.session.userId;

    const wallets = await Wallet.findAll({
            where:{
                userId:userId
            }
    });
    return res.send(wallets);
})


/* ---- END USERS -------------------------------------------------------- */

/* ---- BEGIN WALLET -------------------------------------------------------- */


/*list wallets*/
app.get('/listwallets', async function(req,res) {
	const wallets = await Wallet.findAll();
    return res.send(wallets);
})

/*get wallet by id*/
app.get('/getonewallet/:id', async function(req,res) {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    const wallet = await user.getWallets();
    return res.send(wallet);
})

/* add wallet */
app.post('/wallets/new', async function(req,res) {
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
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

app.put('/wallets/update/:id', async function(req,res) {
    const { coinId, userId, balance, adress } = req.body;
    const walletId = req.params.id;
    try {
        await Wallet.update({
            coinId: coinId,
            userId: userId,
            balance: balance,
            adress: adress,
          },{
              where:{ id:walletId }
            });
        res.status(201).send('Wallet Actualizada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

app.delete('/wallets/delete/:id', async function(req,res) {
    const walletId = req.params.id;
    try {
        await Wallet.destroy({
              where:{ id:walletId }
            });
        res.status(201).send('Wallet Borrada / se fue a cero');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

/* ---- END WALLET -------------------------------------------------------- */

/* ---- BEGIN TRANSACTIONS --------------------------------------------------------*/

app.post('/coins/buy', isAuth, async function(req,res) {
    const { tickerSearch, quantity } = req.body;

    let coinToBuy = await Coin.findOne({ where: { ticker: tickerSearch }});
    let coinUsdt = await Coin.findOne({ where: { ticker: 'USDT' }});
    let userIdBuscado = req.session.userId;


   try {
       const walletUsdt = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinUsdt.id }});
       const walletCoin = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinToBuy.id }});

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

    } catch(err) {
       res.status(500).send('No se pudo realizar la operacion');
    }

})

app.post('/coins/sell', isAuth, async function(req,res) {
    const { tickerSearch, quantity } = req.body;

    let coinToSell = await Coin.findOne({ where: { ticker: tickerSearch }});
    let coinUsdt = await Coin.findOne({ where: { ticker: 'USDT' }});
    let userIdBuscado = req.session.userId;

   try {
       const walletUsdt = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinUsdt.id }});
       const walletCoin = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinToSell.id }});

         let netPay = coinToSell.unitDolarPrice * quantity;
         let resString = "";

        if (walletCoin.balance >= quantity) {

            walletUsdt.balance += netPay;
           await walletUsdt.save();

           walletCoin.balance -= quantity;
           await walletCoin.save();

           resString = 'Vendiste ' + quantity + ' ' + tickerSearch + ' por ' + netPay + ' USDT';
        } else {
           resString = 'No tienes esa cantidad de ' + tickerSearch;
        }
       res.status(201).send(resString);

    } catch(err) {
       res.status(500).send('No se pudo realizar la operacion');
    }

})

app.post('/coins/swap', isAuth, async function(req,res) {
    const { tickerSell, tickerBuy, quantity } = req.body;

    let coinToSell = await Coin.findOne({ where: { ticker: tickerSell }});
    let coinToBuy = await Coin.findOne({ where: { ticker: tickerBuy }});
    let userIdBuscado = req.session.userId;

   try {
        const walletSell = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinToSell.id }});
        const walletBuy = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinToBuy.id }});
        let resString = "";

        
        if (walletSell.balance >= quantity) {

           let netUsdt = quantity * coinToSell.unitDolarPrice;
           walletSell.balance = walletSell.balance - quantity;         
           let quantityCoin = netUsdt/coinToBuy.unitDolarPrice;
           walletBuy.balance = walletBuy.balance + quantityCoin;

           await walletSell.save();
           await walletBuy.save();

           resString = 'Vendiste ' + quantity + ' ' + tickerSell + ' por ' + quantityCoin + tickerBuy;
        } else {
           resString = 'No tienes esa cantidad de ' + tickerSell;
        }
       res.status(201).send(resString);

    } catch(err) {
       res.status(500).send('No se pudo realizar la operacion');
    }

})

app.post('/coins/deposit', isAuth, async function(req,res) {
    const { adress, quantity } = req.body;
    let resString = "";
    
   try {
        let depositWallet = await Wallet.findOne({ where: { adress: adress }});
        
        if(depositWallet != null) {
            let depositCoin = await Coin.findOne({ where: { id: depositWallet.coinId}})
            
            depositWallet.balance += quantity;
            await depositWallet.save();

            resString = 'Depositaste ' + quantity + ' ' + depositCoin.ticker;
        } else {
            resString = 'No existe la wallet';
        }
       
        res.status(201).send(resString);
    } catch(err) {
       res.status(500).send('No se pudo realizar la operacion');
    }

})

app.post('/coins/withdraw', isAuth, async function(req,res) {
    const { adress, ticker, quantity } = req.body;
    let resString = "";
    let userId = req.session.userId; 

   try {
        let withdrawCoin = await Coin.findOne({ where: { ticker: ticker}})
        let withdrawWallet = await Wallet.findOne({ where: { coinId: withdrawCoin.id, userId: userId }});

        if(withdrawWallet != null && withdrawWallet.balance >= quantity) {
            withdrawWallet.balance -= quantity;
            await withdrawWallet.save();
            resString = 'Retiraste ' + quantity + ' ' + ticker + " a la direccion " + adress + ". Balance: " + withdrawWallet.balance;
        } else {
            resString = 'No tienes esa cantidad de ' + ticker;
        }

        res.status(201).send(resString);
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }

})

//  send coins to a user with email
// bug - resString not workin with res.status()
app.post('/coins/sendToEmail', isAuth, async function(req,res) {
    const { email, ticker, quantity } = req.body;
    let userLoggedId = req.session.userId;
    
    try {
        
        let coin = await Coin.findOne({ where: { ticker: ticker}});
        let withdrawWallet = await Wallet.findOne({ where: { coinId: coin.id, userId: userLoggedId }});
        
        let userToSend = await User.findOne({ where: { email: email}});
        let userToSendWallet = await Wallet.findOne({ where: { coinId: coin.id, userId: userToSend.id }});
        
        if(withdrawWallet.balance >= quantity && userToSend != null) {
            
            withdrawWallet.balance = withdrawWallet.balance - quantity;
            userToSendWallet.balance = userToSendWallet.balance + quantity;
            
            await withdrawWallet.save();
            await userToSendWallet.save();
            
            let resString = 'Enviaste ' + quantity + ' ' + ticker + " a " + email + ". Balance: " + withdrawWallet.balance;
             
        } else {
            res.status(201).send("No se pudo realizar la operacion");    
        }
        
        res.status(201).send(resString);
        
    } catch(err) {
        res.status(500).send(err.error);
    }

})







//END TRANSACTION

//------BEGIN NOTIFICATION ------

app.get('/notifications', async function (req,res){
    let notifications = await Notification.findAll()
    return res.send(notifications)
})

//get user notifications
app.get('/getusernotification', async function (req,res){
    const john = await User.findByPk(2);
    const notification = await john.getNotifications();

    return res.send(notification)
})

//------END NOTIFICATION---------

/* METODOS JS -----------------------------------------------------------------------------------------------*/

const getCoinIdByTicker = async function(ticker) {

    let coinSearchedByTicker = await Coin.findOne({ where: { ticker: ticker }});

    return coinSearchedByTicker.id;
}



app.listen(5555);