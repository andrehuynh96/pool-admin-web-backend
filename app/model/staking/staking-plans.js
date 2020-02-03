
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("staking_plans", {
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
    staking_platform_code: {
      type: DataTypes.STRING(8),
      allowNull: false
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
    reward_per_year: {
      type: DataTypes.DOUBLE(4, 2),
      allowNull: false
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    reward_in_diff_platform: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reward_platform: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    reward_token_address: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
} 