const { Temporalize } = require('sequelize-temporalize');

module.exports = (sequelize, DataTypes) => {
  const partner_commission = sequelize.define("settings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.STRING(256),
      allowNull: false
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
    model: partner_commission,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });
  return partner_commission;
}