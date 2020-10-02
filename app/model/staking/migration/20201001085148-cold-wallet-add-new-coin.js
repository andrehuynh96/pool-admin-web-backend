'use strict';
const moment = require('moment');
const uuidV4 = require('uuid/v4');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.describeTable('cold_wallets')
        .then(async (tableDefinition) => {
          const platform = ['ONT','ONE','XTZ','QTUM','TADA'];
          const today = new Date();
          const data = platform.map(item => {
            return {
              platform: item,
              min_amount: 1,
              percentage: 80,
              enable_flg: false,
              created_by: 0,
              updated_by: 0,
              created_at: moment(today).utc()
            };
          });
          data.forEach(item => {
            item.id = uuidV4();
            if (item.platform == 'XTZ') {
              item.amount_unit = 'uxtz';
            }
            else if (item.platform == 'ONT') {
              item.amount_unit = 'ong';
            }
            else if (item.platform == 'QTUM') {
              item.amount_unit = 'uQTUM';
            }
            else if (item.platform == 'TADA') {
              item.amount_unit = 'ada';
            }
            else {
              item.amount_unit = item.platform.toLowerCase();
            }
          });
          for (let item of data) {
            const coldWalletSQL = `Insert Into cold_wallets (id,platform,min_amount,amount_unit,percentage,enable_flg,created_by,updated_by,created_at,updated_at) Values('${item.id}','${item.platform}',${item.min_amount},'${item.amount_unit}',${item.percentage},${item.enable_flg},${item.created_by},${item.updated_by},'${item.created_at}','${item.created_at}')`;
            await queryInterface.sequelize.query(coldWalletSQL, {}, {});
          }
          return Promise.resolve();
        })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
