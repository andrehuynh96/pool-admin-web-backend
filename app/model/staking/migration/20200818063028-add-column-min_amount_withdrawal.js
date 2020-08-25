'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('distribute_commission_cfgs')
          .then(async (tableDefinition) => {
            if (tableDefinition['min_amount_withdrawal']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('distribute_commission_cfgs', 'min_amount_withdrawal', {
              type: Sequelize.DataTypes.DOUBLE,
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
        queryInterface.removeColumn('distribute_commission_cfgs', 'min_amount_withdrawal', { transaction: t }),
      ]);
    });
  }
};
