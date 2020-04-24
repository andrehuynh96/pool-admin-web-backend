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
        queryInterface.describeTable('staking_platforms').then(table => {
          if (!table['using_memo_flg']) {
            return queryInterface.addColumn({
              tableName: 'staking_platforms',
              schema: 'public'
            }, 'using_memo_flg', {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
              }, { transaction: t })
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
  }
};
