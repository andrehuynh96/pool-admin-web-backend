module.exports = (sequelize, DataTypes) => {
  return sequelize.define("erc20_staking_cfgs", {
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
    reward_platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    token_name: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    token_address: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    reward_max_payout: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    }
  }, {
      underscored: true,
      timestamps: true,
    });
}