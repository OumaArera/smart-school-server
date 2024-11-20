'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    static associate(models) {
      // Define association with the User model
      Balance.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE' // When a user is deleted, their balance will also be deleted
      });
    }
  }

  Balance.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  // The 'users' table in the database
          key: 'id'        // The 'id' column of the 'users' table
        }
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false, // Ensure that balance is not null
        defaultValue: 0.0 // Set a default balance of 0
      }
    },
    {
      sequelize,
      modelName: 'Balance',
      tableName: 'balances', // Table name in the database
      timestamps: true // To automatically create 'createdAt' and 'updatedAt' fields
    }
  );

  return Balance;
};
