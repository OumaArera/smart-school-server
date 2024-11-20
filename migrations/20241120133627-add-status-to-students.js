// migrations/<timestamp>-add-status-to-students.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'status', {
      type: Sequelize.ENUM('active', 'deferred', 'expelled', 'suspended', 'graduated'),
      allowNull: false,
      defaultValue: 'active'  // Default value is 'active'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'status');
  }
};
