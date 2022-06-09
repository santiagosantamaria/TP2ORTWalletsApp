'use strict';

const { randBitcoinAddress } = require('@ngneat/falso');
//import { randBitcoinAddress } from '@ngneat/falso';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('wallets',[{
      coinId: 1,
      userId: 2,
      balance: 100,
      adress: randBitcoinAddress(),
      createdAt: new Date,
      updatedAt: new Date
    },
    {
      coinId: 2,
      userId: 1,
      balance: 30,
      adress: randBitcoinAddress(),
      createdAt: new Date,
      updatedAt: new Date
    },
    {
      coinId: 1,
      userId: 2,
      balance: 80,
      adress: randBitcoinAddress(),
      createdAt: new Date,
      updatedAt: new Date
    },
    {
      coinId: 2,
      userId: 2,
      balance: 0,
      adress: randBitcoinAddress(),
      createdAt: new Date,
      updatedAt: new Date
    }
    ],{} );

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Wallets', null, {});

  },
};
