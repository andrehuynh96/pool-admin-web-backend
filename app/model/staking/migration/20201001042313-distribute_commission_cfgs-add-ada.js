'use strict';
const moment = require('moment');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('distribute_commission_cfgs')
          .then(async (tableDefinition) => {
            const stakingPlatformAdaSQL = `Select * From staking_platforms Where platform='TADA' and deleted_flg=false`;
            let [ stakingPlatformAda ] = await queryInterface.sequelize.query(stakingPlatformAdaSQL, {}, {});
            if (stakingPlatformAda[0]) {
              const platform = stakingPlatformAda[0].platform;
              const cycle = 500;
              const cycle_type = 'BLOCK';
              const min_amount = 100;
              const created_by = 0;
              const amount_unit = 'ada';
              const updated_by = 0;
              const staking_platform_id = stakingPlatformAda[0].id;
              const min_amount_withdrawal = 10;
              const today = new Date();
              const created_at = moment(today).utc();
              const updateAdaSQL = `Insert Into distribute_commission_cfgs (platform,cycle,cycle_type,min_amount,created_at,updated_at,created_by, amount_unit,id, updated_by, staking_platform_id, min_amount_withdrawal) Values('${platform}',${cycle}, '${cycle_type}',${min_amount},'${created_at}','${created_at}', ${created_by}, '${amount_unit}',10,${updated_by}, '${staking_platform_id}',${min_amount_withdrawal})`;
              console.log(updateAdaSQL);
              await queryInterface.sequelize.query(updateAdaSQL, {}, {});
            }
            return Promise.resolve();
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

