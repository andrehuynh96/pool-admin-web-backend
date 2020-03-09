module.exports = (sequelize, DataTypes) => {
  return sequelize.define("erc20_staking_payouts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    staking_platform_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    erc20_payout_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    token_name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    token_symbol: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    token_address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    max_payout: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    wait_blockchain_confirm_status_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
      underscored: true,
      timestamps: true,
    });
}