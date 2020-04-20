'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('partner_commissions').then(table => {
          if (!table['partner_updated_by']) {
            queryInterface.addColumn({
              tableName: 'partner_commissions',
              schema: 'public'
            }, 'partner_updated_by', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true
            }, { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('partner_commissions_his').then(table => {
          if (!table['partner_updated_by']) {
            queryInterface.addColumn({
              tableName: 'partner_commissions_his',
              schema: 'public'
            }, 'partner_updated_by', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true
            }, { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('partner_api_keys').then(table => {
          if (!table['partner_updated_by']) {
            queryInterface.addColumn({
              tableName: 'partner_api_keys',
              schema: 'public'
            }, 'partner_updated_by', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true
            }, { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('partner_tx_memos').then(table => {
          if (!table['partner_updated_by']) {
            queryInterface.addColumn({
              tableName: 'partner_tx_memos',
              schema: 'public'
            }, 'partner_updated_by', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true
            }, { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('partner_commissions').then(table => {
          if (table['partner_updated_by']) {
            queryInterface.removeColumn({
              tableName: 'partner_commissions',
              schema: 'public'
            }, 'partner_updated_by', { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('partner_commissions_his').then(table => {
          if (table['partner_updated_by']) {
            queryInterface.removeColumn({
              tableName: 'partner_commissions_his',
              schema: 'public'
            }, 'partner_updated_by', { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('partner_api_keys').then(table => {
          if (table['partner_updated_by']) {
            queryInterface.removeColumn({
              tableName: 'partner_api_keys',
              schema: 'public'
            }, 'partner_updated_by', { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
        queryInterface.describeTable('partner_tx_memos').then(table => {
          if (table['partner_updated_by']) {
            queryInterface.removeColumn({
              tableName: 'partner_tx_memos',
              schema: 'public'
            }, 'partner_updated_by', { transaction: t })
          } else {
            Promise.resolve(true);
          }
        }),
      ]);
    });
  }
};
