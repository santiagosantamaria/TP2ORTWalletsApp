const express = require('express');

const { randBitcoinAddress } = require('@ngneat/falso');
const moment = require('moment');

const app = express();

// accept json in post request
app.use(express.json());

const { Coin, User, Wallet, Notification, Admin, Cronbuy, Transaction, Tag } = require('./src/db/models');
const res = require('express/lib/response');

//http://localhost:5555/

//rutas
app.get('/', function (req,res) {
    res.send('hola')
})



/* ---- BEGIN USERS -------------------------------------------------------- */

app.get('/users', async function(req,res) {
	const users = await User.findAll();
    return res.send(users);
})

app.get('/users/:id', async function(req,res) {
	const userId = 1;
    const user = await User.findByPk(userId);
    return res.send(user);
})

app.get('/users/findbyemail/:email', async function(req,res) {
    const email = req.params.email;
    const user = await User.findOne({ where: { email:email } });

    res.status(201).send(user);

})


// sending params via post json
app.post('/users', async function(req,res) {
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
app.put('/users', async function(req,res) {
    const { firstName, lastName, email, password } = req.body;
    // id should come from authenticated user
    const userId = 1;
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
app.delete('/users/:id', async function(req,res) {
    const userId = 1;
    try {
        await User.destroy({
              where:{ id:userId }
            }).then(async function(){
                await Wallet.destroy({ where: { userId: userId }})
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

        res.status(201).send('Login Ok');

        } catch (error) {
            res.status(500).send();
        }
})

app.post('/users/logout', async function(req,res) {
    res.status(201).send('Logout Ok');
})

/*list user wallets*/
app.get('/listUserWallets', async function(req,res) {
	const userId = 1;

    const wallets = await Wallet.findAll({
            where:{
                userId:userId
            }
    });
    return res.send(wallets);
})


/* ---- END USERS -------------------------------------------------------- */

/* ---- BEGIN WALLET -------------------------------------------------------- */


// get user wallets
app.get('/wallets', async function(req,res) {

    const userId = 1;
    const user = await User.findByPk(userId);
    const wallet = await user.getWallets();
    res.status(201).send(wallet);

})

app.get('/wallets/findbyemail/:email', async function(req,res) {
    const email = req.params.email;
    const user = await User.findOne({ where: { email:email } });

    const wallet = await user.getWallets();
    res.status(201).send(wallet);

})
// add a wallet
app.post('/wallets', async function(req,res) {
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

// edit a wallet
app.put('/wallets', async function(req,res) {
    const { coinId, balance, adress } = req.body;
    let userId = 14;
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

app.delete('/wallets', async function(req,res) {
    const walletId = req.params.id;
    try {
        await Wallet.destroy({
              where:{ id:walletId }
            });
        res.status(201).send('Wallet Borrada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

/* ---- END WALLET -------------------------------------------------------- */

/* ---- BEGIN COINS --------------------------------------------------------*/


app.get('/coins', async function(req,res) {
	const coins = await Coin.findAll();
    return res.send(coins);
})

app.post('/coins/buy', async function(req,res) {
    const { tickerSearch, quantity } = req.body;

    let coinToBuy = await Coin.findOne({ where: { ticker: tickerSearch }});
    let coinUsdt = await Coin.findOne({ where: { ticker: 'USDT' }});
    let userIdBuscado = 1;


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

app.post('/coins/sell', async function(req,res) {
    const { tickerSearch, quantity } = req.body;

    let coinToSell = await Coin.findOne({ where: { ticker: tickerSearch }});
    let coinUsdt = await Coin.findOne({ where: { ticker: 'USDT' }});
    let userIdBuscado = 1;

   try {
       const walletUsdt = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinUsdt.id }});
       const walletCoin = await Wallet.findOne({ where: { userId:userIdBuscado, coinId:coinToSell.id }});

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

    } catch(err) {
       res.status(500).send('No se pudo realizar la operacion');
    }

})

app.post('/coins/swap', async function(req,res) {
    const { tickerSell, tickerBuy, quantity } = req.body;

    let coinToSell = await Coin.findOne({ where: { ticker: tickerSell }});
    let coinToBuy = await Coin.findOne({ where: { ticker: tickerBuy }});
    let userIdBuscado = 1;

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

app.post('/coins/deposit', async function(req,res) {
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

app.post('/coins/withdraw', async function(req,res) {
    const { adress, ticker, quantity } = req.body;
    let resString = "";
    let userId = 1;

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
app.post('/coins/sendToEmail', async function(req,res) {
    const { email, ticker, quantity } = req.body;
    let userLoggedId = 1;
    
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
            
            var resString = 'Enviaste ' + quantity + ' ' + ticker + " a " + email + ". Balance: " + withdrawWallet.balance;
             
        } else {
            res.status(201).send("No se pudo realizar la operacion");    
        }
        
        res.status(201).send(resString);
        
    } catch(err) {
        res.status(500).send(err.error);
    }

})


//END COINS

//------BEGIN NOTIFICATION ------

//LIST ALL NOTIFICATIONS
app.get('/notifications', async function (req,res){
    let notifications = await Notification.findAll()
    return res.send(notifications)
})

//get user notifications (logged user)
app.get('/notifications/mynotifications', async function (req,res){
    const userId = 1;

    const user = await User.findByPk(userId);
    const notification = await user.getNotifications();

    return res.send(notification)
})

//new notification
// sending params via post json
app.post('/notifications', async  function (req, res){
   console.log('METODO NEW NOTIFICATION')
    const {title, text} = req.body;
   const userId = 27;

    try{
        let user = await User.findOne({ where:{ id:userId }});


        if(user == null){
            res.status(500).send('No se encontro a un usuario con ese id');
        }else{
            let newNotification = await Notification.create({title: title, text: text, userId:userId, seen: 0}) //COMO LE PASO LA FECHA?

        }
        res.status(201).send('NOTIFICACION CREADA');

    }catch (err){
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
})

app.delete('/notifications/:id', async function(req,res) {
    const notificationId = req.params.id;
    try {
        await Notification.destroy({
            where:{ id:notificationId }
        });
        res.status(201).send('Notificacion Borrada del sistema');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

//marcar una notificacion como leida
app.put('/notifications/markasseen/', async function(req,res) {
    const notificationId = 13;

    try {
        await Notification.update({
           seen: 1
        },{
            where:{ id:notificationId }
        });
        res.status(201).send('Notificacion leida');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

//actualizar una notificacion
app.put('/notifications', async function(req,res) {
    const { title, text } = req.body;
    const notificationId = 1;

    try {
        await Notification.update({
           title: title,
            text: text,
            seen: 0
        },{
            where:{ id:notificationId }
        });
        res.status(201).send('Notificacion Actualizada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

//------END NOTIFICATION---------

//---------------------------------------BEGIN TRANSACTIONS---------------------------------
//LIST ALL TRANSACTIONS
app.get('/transactions', async function (req,res){
    let transactions = await Transaction.findAll();
    return res.send(transactions)
})

//nueva transaccion (log)
// sending params via post json
app.post('/transactions', async  function (req, res){

    const {text} = req.body;
    const walletId = 5;
    try{
        let wallet = await Wallet.findOne({ where: { id:walletId }});


        if(wallet == null){
            res.status(500).send('No se creo la transaccion ya que no existe esa wallet');
        }else{
            let newTransaction = await Transaction.create({text: text, walletId:walletId})
        }
        res.status(201).send('Transaccion CREADA');

    }catch (err){
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
})



//actualizar transaccion (log)
//actualizar una notificacion
app.put('/transactions', async function(req,res) {
    const {text} = req.body;
    const transactionId = 2;

    try {
        await Transaction.update({
            text: text,
        },{
            where:{ id:transactionId }
        });
        res.status(201).send('Transaccion Actualizada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

//eliminar transaccion
app.delete('/transactions/:id', async function(req,res) {
    const transactionId = req.params.id;
    try {
        await Transaction.destroy({
            where:{ id:transactionId }
        });
        res.status(201).send('Transaccion Borrada del sistema');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})



//---------------------------------------END TRANSACTIONS-----------------------------------

/* METODOS JS -----------------------------------------------------------------------------------------------*/

const getCoinIdByTicker = async function(ticker) {

    let coinSearchedByTicker = await Coin.findOne({ where: { ticker: ticker }});

    return coinSearchedByTicker.id;
}


// ---- CRON BUYs -------------------------------

// set a cron buy for a user
app.post('/cronbuys', async function(req,res) {
    const { ticker, usdAmount, frequency } = req.body;
    let userId = 27;
    try {
        let coin   = await Coin.findOne({ where:{ ticker:ticker }});
        let coinId = coin.id;
        let cron = await Cronbuy.findOne({ where:{ userId:userId, coinId:coinId }});

        if(cron) {
            try {
                await cron.update({
                    userId: userId,
                    coinId: coinId,
                    usdAmount: usdAmount,
                    frequency: frequency
                });
                res.status(201).send('Compra Recurrente Actualizada');
            } catch(err) {
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

    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

// delete a cron buy for a user
app.delete('/cronbuys/:ticker', async function(req,res) {
    const userId = 27;
    const ticker = req.params.ticker;
    try {
        let coin = await Coin.findOne({ where:{ ticker:ticker }});
        let coinId = coin.id;
        await Cronbuy.destroy({
              where:{ userId:userId,coinId:coinId }
            });
        res.status(201).send('Se Ha Eliminado La Compra Recurrente de ' + ticker);
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

// modify $usd Amount or frequency (days) for a cron buy
app.put('/cronbuys', async function(req,res) {
    const { ticker, usdAmount, frequency } = req.body;
    let userId = 27;

    try {

        let coin   = await Coin.findOne({ where:{ ticker:ticker }});
        let coinId = coin.id;

        let cron = await Cronbuy.findOne({ where:{ userId:userId, coinId:coinId }});

        if(cron) {
            try {
                await cron.update({
                    userId: userId,
                    coinId: coinId,
                    usdAmount: usdAmount,
                    frequency: frequency
                });
                res.status(201).send('Compra Recurrente Actualizada');
            } catch(err) {
                res.status(500).send('No Tiene Compras Recurrentes de ' + ticker)
            }
         } else {

            res.status(500).send('No se pudo realizar la operacion');
         }

    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

// run the cron buy
async function runCronBuys() {

    const cronBuys = await Cronbuy.findAll();
    let today = moment();
    try{
        for (const cron of cronBuys) {
            let diffDays = today.diff(cron.lastPurchaseDate,'days');


           console.log( " -------DIFF DAYS --------" + diffDays)
            console.log( " -------crons frecuency --------" + cron.frequency)
            if(diffDays >= cron.frequency) {
                let coinToBuy = await Coin.findByPk(cron.coinId);

                let usdtCoin  = await Coin.findOne({ where: { ticker: 'USDT' }});

                // User USD wallet
                let usdUserWallet = await Wallet.findOne({ where: { coinId:usdtCoin.id, userId:cron.userId }});
                // User XX Coin Wallet
                let coinUserWallet = await Wallet.findOne({ where: { coinId:cron.coinId, userId:cron.userId }});

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
                   await Notification.create({title: "COMPRA RECURRENTE COMPLETADA", text: "COMPRASTE  " + cron.usdAmount  + " de " + coinToBuy.ticker, userId: cron.userId, seen: 0})
                }else{
                    console.log("ENTRE AL ELSE")
                    await Notification.create({title: "COMPRA RECURRENTE FALLIDA", text: "No pudiste comprar  " + coinToBuy.ticker  + " por saldo insuficiente", userId: cron.userId, seen: 0})
                }
            }

        }
    } catch(e) {
        console.log(e.error);
        res.status(500).send('Error en Cron Buys');
    }
}

// probando cron buy / seria un cron job del servidor en realidad
app.get('/cronbuys/run', async function(req,res) {
    try {
        await runCronBuys();
        res.status(201).send('Cron Buys Ejecutado Ok');
    } catch(e) {
        res.status(501).send('Error en Cron buys');
    }
});


// ---- END CRON BUY -------------------------------

/* ---- BEGIN TAG -------------------------------------------------------- */

app.get('/listtags', async function(req,res) {
	const tag = await Tag.findAll();
    return res.send(tag);
})

app.get('/tags/find/:id', async function(req,res) {
	const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    return res.send(tag);
})

/* add tag */
app.post('/tags/new', async function(req,res) {
    const {name, coinId} = req.body;
    try {
        let newTag = await Tag.build({
            name: name,
            coinId: coinId,
          });
          newTag.save();
        res.status(201).send('Tag Registrada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

app.put('/tags/update/:id', async function(req,res) {
    const {name, coinId} = req.body;
    const tagId = req.params.id;
    try {
        await Tag.update({
            name: name,
            coinId: coinId,
          },{
              where:{ id:tagId }
            });
        res.status(201).send('Tag Actualizada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
})

app.delete('/tags/delete/:id', async function(req,res) {
    const tagId = req.params.id;
    try {
        await Tag.destroy({
              where:{ id:tagId }
            });
        res.status(201).send('Tag eliminada');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
})

app.get('/tagsfrom/coin/:id', async function(req,res) {
	const _coinId = req.params.id;
    const coin = await Coin.findByPk(_coinId);
    const coinName = coin.name;

    const tagsFromCoin = await Tag.findAll({
        attributes: ["name"],
        raw:true,
        where: {coinId:_coinId}
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
    return res.send(returnTagsAndCoins);
})



// ---- END TAGS -------------------------------


app.listen(5555);