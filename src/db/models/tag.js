'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {

      Tag.belongsTo(models.Coin, {foreignKey: "coinId"})


    }
  }
  Tag.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    coinId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,



  },

   {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags'
  });
  return Tag;
};