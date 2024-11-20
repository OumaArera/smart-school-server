'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Define associations here
      Student.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'SET NULL'  // If the user is deleted, set userId to null
      });
    }
  }
  Student.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      admissionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true, // This can be null
      },
      sex: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      years: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fees: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
          model: 'users', 
          key: 'id' 
        },
        onDelete: 'SET NULL' 
      },
      status: {
        type: DataTypes.ENUM('active', 'deferred', 'expelled', 'suspended', 'graduated'),
        allowNull: false,
        defaultValue: 'active'  // Default value is 'active'
      }
    },
    {
      sequelize,
      modelName: 'Student',
      tableName: 'students', // Name of the table in the database
      timestamps: true // To store createdAt and updatedAt
    }
  );
  return Student;
};
