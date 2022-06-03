'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Coin extends Model {
        static associate(models) {
            
        }
    }
    Coin.init({
        id: {
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },

          name: {
            type: DataTypes.STRING,
            allowNull: false
    
          },
    
          ticker: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
          },
    
          unitDolarPrice: {
            type: DataTypes.FLOAT,
            allowNull: false
          },
    
          createdAt: DataTypes.DATE,
          updatedAt: DataTypes.DATE,
          deletedAt: DataTypes.DATE,
          
      } , {
        sequelize,
        modelName: 'Coin',
        tableName: 'coins'
    });
    return Coin;
};