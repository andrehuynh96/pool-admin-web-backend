const { Temporalize } = require('sequelize-temporalize');

module.exports = (sequelize, DataTypes) => {
  const distribute_commission_cfg = sequelize.define("distribute_commission_cfgs", {
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
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
      underscored: true,
      timestamps: true,
    });

  Temporalize({
    model: distribute_commission_cfg,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });
  return distribute_commission_cfg;
}