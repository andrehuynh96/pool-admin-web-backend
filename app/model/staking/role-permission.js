const UserStatus = require("./value-object/user-status");
const VerifyTokenType = require("./value-object/verify-token-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("role_permissions", {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 