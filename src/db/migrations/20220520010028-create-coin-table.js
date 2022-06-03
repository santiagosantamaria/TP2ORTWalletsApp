'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Coins', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false

      },

      ticker: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      unitDolarPrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false
      },

      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt: Sequelize.DataTypes.DATE,

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Coins', null, {});
  }
  
};
