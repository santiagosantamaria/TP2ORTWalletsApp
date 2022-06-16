'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.bulkInsert('Coins', [{
       name: 'Bitcoin',
        ticker: 'BTC',
       unitDolarPrice: 30000.0,
       createdAt: new Date,
       updatedAt: new Date
      },
      {
        name: 'Etherum',
        ticker: 'ETH',
        unitDolarPrice: 2500.0,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        name: 'Solana',
        ticker: 'SOL',
        unitDolarPrice: 48.5,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        name: 'Tether',
        ticker: 'USDT',
        unitDolarPrice: 1.0,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        name: 'Litecoin',
        ticker: 'LTC',
        unitDolarPrice: 68.0,
        createdAt: new Date,
        updatedAt: new Date
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Coins', null, {});

  }
};
