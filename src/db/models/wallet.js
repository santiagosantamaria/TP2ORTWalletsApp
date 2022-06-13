'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Wallet extends Model {
        static associate(models) {
            Wallet.belongsTo(models.User,{
                foreignKey: 'userId',
            }),
            Wallet.hasOne(models.Coin,{
              foreignKey: 'id',
          }),
          Wallet.hasMany(models.Transaction)
        }
    }
    Wallet.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
    
          coinId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
          },
    
          userId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
          },
    
          balance: {
            type: DataTypes.FLOAT,
            allowNull: false
          },
    
          adress: {
            type: DataTypes.STRING,
            allowNull: false
          },
    
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