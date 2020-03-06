module.exports = (sequelize, DataTypes) => {
  return sequelize.define("erc20_payout_cfgs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    }
  }, {
      underscored: true,
      timestamps: true,
    });
}