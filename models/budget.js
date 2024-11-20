'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      // Define association with User model (assuming User model has been defined)
      Budget.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE' // If a user is deleted, delete the related budget
      });
    }
  }

  Budget.init(
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false, // Category cannot be null
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assuming the table name is 'users'
          key: 'id'
        },
        onDelete: 'CASCADE' // If the user is deleted, the budget will also be deleted
      },
      items: {
        type: DataTypes.JSON, // Using JSON data type to store budget items
        allowNull: false, // Items must not be null
      },
      status: {
        type: DataTypes.ENUM('approved', 'declined', 'pending'),
        defaultValue: 'pending', // Default status is pending
        allowNull: false, // Status cannot be null
      },
      reason: {
        type: DataTypes.STRING(1000), // String with a max length of 1000 characters
        allowNull: true, // Reason can be null (optional)
      }
    },
    {
      sequelize,
      modelName: 'Budget',
      tableName: 'budgets', // Name of the table in the database
      timestamps: true, // To store createdAt and updatedAt
    }
  );

  return Budget;
};
