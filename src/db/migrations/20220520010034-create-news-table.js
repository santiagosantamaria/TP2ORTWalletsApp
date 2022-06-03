'use strict';
/*
NEWS: 
news_id: int
title: string
text: string
category_id: int
*/

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('news', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      category_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },

      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt: Sequelize.DataTypes.DATE,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('news', null, {});
  }
};
