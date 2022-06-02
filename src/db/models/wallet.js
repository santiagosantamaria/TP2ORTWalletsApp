'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Wallet extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Wallet.belongsTo(models.user,{
                foreignKey: 'userId',
            })
        }
    }
    Wallet.init({
      
      id: DataTypes.INTEGER,
      coinId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      balance: DataTypes.FLOAT,
      adress: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE

      } , {
        sequelize,
        modelName: 'Wallet',
        tableName: 'wallets'
    });
    return Wallet;
};