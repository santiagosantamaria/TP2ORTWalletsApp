const { User, Coin, Wallet, Notification, Cronbuy, Transaction, Tag } = require('../db/models');
// random Address for user wallet
const { randBitcoinAddress } = require('@ngneat/falso');

exports.getAll = async(req, res) => {
    try {
        const users = await User.findAll();
        return res.status(201).send(users);
    } catch (err) {
        return res.status(500).send('No se pudo realizar la operacion' + err);
    }
};

exports.getUserById = async function(req, res) {
    try {
        const userId = 1;
        const user = await User.findByPk(userId);
        return res.status(201).send(user);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }

};

exports.findUserByEmail = async function(req, res) {
    try {
        const email = req.params.email;
        const user = await User.findOne({ where: { email: email } });
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
};


// // sending params via post json
exports.addUser = async function(req, res) {
    const { firstName, lastName, email, password } = req.body;
    console.log(email);
    try {
        let user = await User.findOne({ where: { email: email } });

        if (user) {
            res.status(201).send('Ya existe un usuario con ese email');
        } else {
            let newUser = await User.build({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            });

            newUser.save().then(async function() {


                let user = await User.findOne({ where: { email: email } });
                let userId = user.id;

                let allCoins = await Coin.findAll();

                // // creating an empty wallet for the User, with every Coin
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

    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

// Update a user
exports.editUser = async function(req, res) {
    const { firstName, lastName, email, password } = req.body;
    // id should come from authenticated user
    const userId = 1;
    try {
        await User.update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }, {
            where: { id: userId }
        });
        res.status(201).send('Usuario Actualizado');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
};

// Delete a user by id // asociations not checked
exports.deleteUser = async function(req, res) {
    const userId = 46;

    try {
        await User.destroy({
            where: { id: userId }
        }).then(async function() {
            await Wallet.destroy({ where: { userId: userId } })
        });
        res.status(201).send('Usuario Borrado');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

// Test login with email and password // Should be with JWT !!  
exports.loginUser = async function(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, password } })

        if (user == null) {
            return res.status(400).send('Usuario no encontrado');
        }

        res.status(201).send('Login Ok');

    } catch (error) {
        res.status(500).send();
    }
};
exports.logoutUser = async function(req, res) {
    res.status(201).send('Logout Ok');
};

/* list user wallets */
exports.getUserWallets = async function(req, res) {

    try {
        const userId = 1;
        const wallets = await Wallet.findAll({
            where: {
                userId: userId
            }
        });
        return res.status(201).send(wallets);
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion' + err);
    }

};