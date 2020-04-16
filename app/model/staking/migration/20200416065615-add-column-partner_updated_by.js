'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable('partner_commissions').then(table => {
      if (!table['partner_updated_by']) {
        queryInterface.addColumn({
          tableName: 'partner_commissions',
          schema: 'public'
        }, 'partner_updated_by', {
          type: Sequelize.DataTypes.UUID,
          allowNull: true
        })
      } else {
        Promise.resolve(true);
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.describeTable('partner_commissions').then(table => {
      if (table['partner_updated_by']) {
        queryInterface.removeColumn({
          tableName: 'partner_commissions',
          schema: 'public'
        }, 'partner_updated_by')
      } else {
        Promise.resolve(true);
      }
    })
  }
};
