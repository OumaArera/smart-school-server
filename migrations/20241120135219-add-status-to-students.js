// migrations/[timestamp]-add-payment-fields-to-fees.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('fees', 'paymentType', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('fees', 'transactionId', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('fees', 'purpose', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('fees', 'transxId', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('fees', 'paymentType');
    await queryInterface.removeColumn('fees', 'transactionId');
    await queryInterface.removeColumn('fees', 'purpose');
    await queryInterface.removeColumn('fees', 'transxId');
  }
};
