'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag_coins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tag_coins.init({
    tagId: DataTypes.INTEGER,
    coinId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tag_coins',
  });
  return tag_coins;
};