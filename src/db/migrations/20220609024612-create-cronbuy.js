'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cronbuys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      coinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      usdAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      frequency: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lastPurchaseDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cronbuys');
  }
};