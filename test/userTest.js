const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;


describe('User Insertion in DB', function () {
    before('Setting up Database - Insert User', async () => {
        await axios({
            method: 'post',
            url: 'http://localhost:5555/users',
            data: {
                firstName: "Edmund", 
                lastName: "Van Dycke", 
                email: "edmunart@gmail.com", 
                password: "12345"
            },
        });
    });
    
    it('User should have wallets', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost:5555/wallets/findbyemail/edmunart@gmail.com',
        }).then(res => {
            assert.equal(res.status,201);
            done();
        });
        
    });
});
