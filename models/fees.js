// models/fees.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fees extends Model {
    static associate(models) {
      // Define the associations with Student and User models
      Fees.belongsTo(models.Student, {
        foreignKey: 'studentId',
        onDelete: 'CASCADE'
      });
      Fees.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }

  Fees.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      paymentType: {
        type: DataTypes.STRING, // Added paymentType column
        allowNull: false // Assuming this is required
      },
      transactionId: {
        type: DataTypes.STRING, // Added transactionId column
        allowNull: true // This is nullable
      },
      purpose: {
        type: DataTypes.STRING, // Added purpose column
        allowNull: false // Assuming purpose is required
      },
      transxId: {
        type: DataTypes.STRING, // Added transxId column
        allowNull: false, 
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Fees',
      tableName: 'fees', // Name of the table in the database
      timestamps: true // To store createdAt and updatedAt
    }
  );

  return Fees;
};
