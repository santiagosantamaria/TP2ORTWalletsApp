'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('wallets', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      coinId: {
        type: Sequelize.DataTypes.INTEGER,
        unique: false,
        allowNull: false
      },

      userId: {
        type: Sequelize.DataTypes.INTEGER,
        unique: false,
        allowNull: false
      },

      balance: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false
      },

      adress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },

      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
      deletedAt:{
        type: Sequelize.DataTypes.DATE
      }
    });


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('wallets');
    
  }
};
