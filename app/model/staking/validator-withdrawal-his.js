module.exports = (sequelize, DataTypes) => {
  return sequelize.define("validator_withdrawal_his", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    platform: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    commission_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    from_block: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    to_block: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tx_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    transaction_log: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    distribution_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    validator: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cycle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cycle_withdraw_reward: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount_withdraw: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });

};
