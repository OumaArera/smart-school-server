// migrations/XXXXXX-add-user-id-to-students.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null values for existing students who might not have a linked user
      references: {
        model: 'users', // Reference to the users table
        key: 'id' // Reference to the id field in the users table
      },
      onDelete: 'SET NULL' // If the associated user is deleted, set userId to null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'userId');
  }
};
