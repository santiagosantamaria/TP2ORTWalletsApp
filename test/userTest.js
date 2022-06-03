const axios = require('axios')
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;

// describe('Card association', () => {
//     let cardNumber = "1234567812345678"

//     it ('return 201 if card is saved', (done) => {
//         axios({
//             method : 'post',
//             url: 'http://localhost:6001/cards',
//             data : {code: cardNumber, passengerId: 1 }
//         }).then(response => {
//             assert.equal(response.status, 201)
//             done()
//         }).catch(err => {
//             assert.equal(err.response.status, 422)
//             done()
//         })
//     })

//     it ('returns error if card exists', (done) => {
//         axios({
//             method : 'post',
//             url: 'http://localhost:6001/cards',
//             data : {code: cardNumber, passengerId: 1 }
//         })
//         .catch(err => {
//             assert.equal(err.response.data.message, 'CARD_EXISTS')
//             done()
//         })
//     }) 
// })

describe('Users exist', () => {
        it ('return {} if Users exist', (done) => {
        axios({
            method : 'get',
            url: 'http://localhost:5555/listusers'
        }).then(response => {
            assert.equal(response.status, {})
            done()
        }).catch(err => {
            assert.equal(err.response.status, 422)
            done()
        })
    })    
}); 
