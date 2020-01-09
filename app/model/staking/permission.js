const UserStatus = require("./value-object/user-status");
const VerifyTokenType = require("./value-object/verify-token-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("permissions", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 