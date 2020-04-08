'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('payout_cfgs').then(tab => {
          if (!tab) {
            queryInterface.describeTable('erc20_payout_cfgs').then(table => {
              if (table) {
                queryInterface.renameTable('erc20_payout_cfgs', 'payout_cfgs');
              } else {
                Promise.resolve(true);
              }
            })
          } else {
            Promise.resolve(true);
          }
        }), 
        queryInterface.describeTable('staking_payouts').then(tab => {
          if (!tab) {
            queryInterface.describeTable('erc20_staking_payouts').then(table => {
              if (table) {
                queryInterface.renameTable('erc20_staking_payouts', 'staking_payouts');
                if (table['erc20_payout_id']) {
                  queryInterface.renameColumn('staking_payouts', 'erc20_payout_id', 'payout_id');
                } else {
                  Promise.resolve(true);
                }
              } else {
                Promise.resolve(true);
              }
            })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('staking_plans').then(tab => {
          if (!tab) {
            queryInterface.describeTable('erc20_staking_plans').then(table => {
              if (table) {
                queryInterface.renameTable('erc20_staking_plans', 'staking_plans');
                if (table['erc20_staking_payout_id']) {
                  queryInterface.renameColumn('staking_plans', 'erc20_staking_payout_id', 'staking_payout_id');
                } else {
                  Promise.resolve(true);
                }
              } else {
                Promise.resolve(true);
              }
            })
          } else {
            Promise.resolve(true);
          }
        })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        
      ]);
    });
  }
};
