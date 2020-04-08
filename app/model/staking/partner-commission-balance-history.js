const DeliveryStatus = require("./value-object/partner-commission-balance-status");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("partner_commission_balance_his", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    partner_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    distribute_commission_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: DeliveryStatus.UNDELIVERED,
    },
    distribute_commission_id_at: {
      type: DataTypes.STRING(128),
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
}

