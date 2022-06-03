'use strict';

const { randAlphaNumeric } = require('@ngneat/falso')

module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 20; i++) {
      await queryInterface.bulkInsert('notifications',[{
        title: "Noticia " + i,
        text: "Este es el texto de la notificacion " + i,
        date: new Date,
        seen: 0,
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
    return queryInterface.dropTable('wallets');
  }
};
