const express = require('express');
const session = require('express-session');
const app = express();


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

const { Coin, User, Wallet } = require('./src/db/models');

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
    
    let user = await User.findOne({email});
    if(user) {
        res.status(201).send('Ya existe un usuario con ese email');
    }
    try {
        let newUser = await User.build({
            firstName: firstName, 
            lastName: lastName, 
            email: email, 
            password: password
          });
        newUser.save();
        res.status(201).send('Usuario Registrado');
    } catch(err) {
        res.status(500).send('No se pudo realizar la operacion')
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
app.listen(5555);