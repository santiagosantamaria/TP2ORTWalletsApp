const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;


// describe('Users in DB', function () {
//     it('Users Have to be 13', async function () {
//         const users = await axios.get('http://localhost:5555/users/all');
//         assert.equal(users.data.length, 13);
//     });
// });

describe('User Insertion in DB', function () {
    it('User should be inserted in DB', async function () {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5555/users/register',
            data: {
                firstName: "Edmund", 
                lastName: "Van Dycke", 
                email: "edmunart@gmail.com", 
                password: "12345"
            },
        });
        assert.equal(res.status,201);
    });
});

describe('User Insertion in DB', function () {
    it('User should be inserted in DB',  function (done) {
        // let res =  
        axios({
            method: 'post',
            url: 'http://localhost:5555/users/register',
            data: {
                firstName: "Edmund", 
                lastName: "Van Dycke", 
                email: "edmunart@gmail.com", 
                password: "12345"
            },
        }).then(res => {
            assert.equal(res.status,201);
            done();
        });
        
    });
});

// describe('Edit User in DB', function () {
//     it('User info should be edited in DB', async function () {
        
//         let login = await axios({
//             method: 'post',
//             url: 'http://localhost:5555/users/login',
//             data: {
//                 email: "san@gmail.com", 
//                 password: "1234"
//             },
//         }).then(function(login) {
//             console.log(login);
//             let res = axios({
//                 method: 'put',
//                 url: 'http://localhost:5555/users/update',
//                 data: {
//                     firstName: "Santiago", 
//                     lastName: "STM", 
//                     email:    "san@gmail.com",
//                     password: "1234"
//                     },
//             });
//             assert.equal(res.status,201);
//         });
        
//     });
// });

describe('Edit User in DB', function () {
    it('User info should be edited in DB', async function () {
        let userid = 1;
        let res = await axios({
                method: 'put',
                url: 'http://localhost:5555/users/update/'+ userid,
                data: {
                    firstName: "Juan", 
                    lastName: "Administrador", 
                    email:    "admin@mail.com",
                    password: "12345"
                    },
            });
            assert.equal(res.status,201);
        });
        
});


describe('Buy a coin with USDT', function () {
    it('User should login and buy a coin', async function () {
        
        let login = await axios({
            method: 'post',
            url: 'http://localhost:5555/users/login',
            data: {
                email: "san@gmail.com", 
                password: "1234"
            },
        }).then(function(login) {
            console.log(login.data + " login OK ");
            let res = axios({
                method: 'put',
                url: 'http://localhost:5555/coins/buy',
                data:
                    {
                        "tickerSearch": "LTC", 
                        "quantity": 999
                    },
            });
            assert.equal(res.status,201);
        });
        
    });
});