const UserStatus = require("./value-object/user-status");
const VerifyTokenType = require("./value-object/verify-token-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_roles", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 