const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;


describe('Tag Insertion in DB', function () {
    before('Setting up Database - Insert Tag', async () => {
        await axios({
            method: 'post',
            url: 'http://localhost:5555/tags/new',
            data: {
                name: "Mineable", 
                coinId: 3
            },
        });
    });
    
    it('Tag should exist', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost:5555/tags/find/11',
        }).then(res => {
            assert.equal(res.status,201);
            done();
        });
        
    });
});


describe('Coin with his tags', function () {
    
    it('Solana Coin should have 2 tags', function () {

        let res = axios({   
            method: 'get',
            url: 'http://localhost:5555/tagsfrom/coin/3',
        }).then(res => {
            
        let result = res.body;
    //    console.log(result);

        let expectedResult = "Solana, Staking, Mineable"

        assert.equal(result, expectedResult, "Test tags from coin");


        });
      
    });
});
