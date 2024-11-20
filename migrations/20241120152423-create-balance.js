'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('balances', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  // The 'users' table in the database
          key: 'id'        // The 'id' column from the 'users' table
        },
        onDelete: 'CASCADE',  // If the associated user is deleted, delete the balance too
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,  // Default balance value is 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'), // Default to the current timestamp
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'), // Default to the current timestamp
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the table creation
    await queryInterface.dropTable('balances');
  }
};
