'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
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
    createdAt: {
      allowNull: false,
      type: Sequelize.DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DataTypes.DATE
    },
    deletedAt: Sequelize.DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};