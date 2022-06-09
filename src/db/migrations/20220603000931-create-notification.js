'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      seen: {
        type: Sequelize.DataTypes.INTEGER,
      },

      userId: {
        type: Sequelize.DataTypes.INTEGER,
        unique: false,
        allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      deletedAt: Sequelize.DataTypes.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
  }
};