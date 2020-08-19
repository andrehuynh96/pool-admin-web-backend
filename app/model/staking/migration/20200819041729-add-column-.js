'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('cold_wallets')
          .then(async (tableDefinition) => {
            if (tableDefinition['email_notification']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('cold_wallets', 'email_notification', {
              type: Sequelize.DataTypes.STRING(250),
              allowNull: true,
            });

            return Promise.resolve();
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('cold_wallets', 'email_notification', { transaction: t }),
      ]);
    });
  }
};
