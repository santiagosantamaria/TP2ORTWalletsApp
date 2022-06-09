'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cronbuy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cronbuy.init({
    id: {
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    coinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastPurchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Cronbuy',
    tableName: 'cronbuys'
  });
  return Cronbuy;
};