const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;

  
describe('Users in DB', function () {
    it('Users Have to be 12', async function () {
        const users = await axios.get('http://localhost:5555/users/all');
        // console.log(users);
        assert.equal(users.data.length, 12);
    });
});


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