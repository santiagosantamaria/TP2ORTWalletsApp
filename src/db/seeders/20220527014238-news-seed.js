'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('news', [{
      title: 'Subio Bitcoin',
      text: 'Lorem ipsum',
      category_id: 1,
      createdAt: new Date,
      updatedAt: new Date
  }
], {});

  },

  async down (queryInterface, Sequelize) {
    //return queryInterface.dropTable('news');
    
  }
};
