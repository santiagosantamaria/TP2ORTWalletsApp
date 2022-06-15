'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 1; i <= 4; i++) {
      await queryInterface.bulkInsert('transactions',[{
        text: "Transaccion " + i + " Agregaste $0 a tu wallet",
        walletId: i,
        createdAt: new Date,
        updatedAt: new Date
      }
      ], );
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
