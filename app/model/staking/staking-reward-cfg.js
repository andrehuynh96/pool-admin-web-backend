module.exports = (sequelize, DataTypes) => {
  return sequelize.define("staking_reward_cfgs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    platform: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    commission: {
      type: DataTypes.DOUBLE(4, 2),
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
}