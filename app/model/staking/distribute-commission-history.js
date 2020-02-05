const TransactionStatus = require("./value-object/transaction-status");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("distribute_commission_his", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    partner_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    distribute_commission_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    partner_address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    transaction_log: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: TransactionStatus.PENDING,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    balance_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    commission_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
  }, {
      underscored: true,
      timestamps: true,
    });
} 