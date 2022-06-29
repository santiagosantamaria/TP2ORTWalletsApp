const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;


describe('Tag Insertion in DB', function() {
    before('Setting up Database - Insert Tag', async() => {
        await axios({
            method: 'post',
            url: 'http://localhost:5555/tags',
            data: {
                name: "Mineable",
                coinId: 3
            },
        });
    });

    it('Tag should exist', function(done) {
        axios({
            method: 'get',
            url: 'http://localhost:5555/tags/find/1',
        }).then(res => {
            console.log("------------------------------" + res.data.id)
            assert.equal(res.status, 201);
            done();
        });

    });
});

describe('Coin with his tags', function() {
    it('Solana Coin should have 2 tags', function(done) {
        axios({
            method: 'get',
            url: 'http://localhost:5555/tags/getcointags/3',
        }).then(res => {
            assert.equal(res.status, 201);
            done();
        });
    });
});