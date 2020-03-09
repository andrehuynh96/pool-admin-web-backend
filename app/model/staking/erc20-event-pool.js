const TransactionStatus = require("./value-object/transaction-status");
const EventType = require("./value-object/fire-event-type");

module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define("erc20_event_pools", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    tx_id: {
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
    event_type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: EventType.DB_SCRIPT,
    },
    successful_event: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    fail_event: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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

  return Model;
}