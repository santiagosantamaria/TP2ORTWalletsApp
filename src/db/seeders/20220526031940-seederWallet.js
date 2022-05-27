'use strict';

const { randAddress } = require('@ngneat/falso')

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('wallets',[{
      coinId: 2,
      userId: 2,
      balance:100,
      adress:randAddress().street,
      createdAt: new Date,
      updatedAt: new Date
    }
    ], );

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.dropTable('wallets');
  }
};
