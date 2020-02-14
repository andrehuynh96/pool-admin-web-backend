const Temporal = require('sequelize-temporal');
module.exports = (sequelize, DataTypes) => {
  const distribute_commission_cfg =  sequelize.define("distribute_commission_cfgs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    platform: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    cycle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cycle_type: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    min_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    amount_unit: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
  Temporal(distribute_commission_cfg, sequelize, { blocking: true, full: false });
  return distribute_commission_cfg;
}