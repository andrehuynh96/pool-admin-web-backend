const StakingPlatformStatus = require("./value-object/staking-platform-status");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("erc20_staking_plans", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    staking_platform_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration_type: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: 'DAY'
    },
    reward_percentage: {
      type: DataTypes.DOUBLE(4, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: StakingPlatformStatus.COMMING_SOON
    },
    reward_diff_token_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    erc20_staking_payout_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diff_token_rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
  }, {
      underscored: true,
      timestamps: true,
    });
} 