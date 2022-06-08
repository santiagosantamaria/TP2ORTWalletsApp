const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;


describe('Index Response',() => {
    it('Index should be 201', async function() {
        axios({ method : 'get', url: 'http://localhost:5555/' })
            .then((res)=>{
                assert.equal(res.status,201);
            }).catch(err => {
                assert.equal(err.response.status, 422)
            })
    });
})

describe('List All Users Response',() => {
    it('Users should be an Arary', async function() {
        axios({ method : 'get', url: 'http://localhost:5555/users/all' })
            .then((res)=>{
                assert.equal(res,res);
            }).catch(err => {
                assert.equal(err.response.status, 422)
            })
    });
})
