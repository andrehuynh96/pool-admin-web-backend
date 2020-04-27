
const { Temporalize } = require('sequelize-temporalize');
module.exports = (sequelize, DataTypes) => {
  const ColdWallet = sequelize.define("cold_wallets", {
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
    reward_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    min_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    amount_unit: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    percentage: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    enable_flg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    Temporalize({
      model: ColdWallet,
      sequelize,
      temporalizeOptions: {
        blocking: false,
        full: false,
        modelSuffix: "_his"
      }
    });
  return ColdWallet;
}