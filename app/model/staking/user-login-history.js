const UserStatus = require("./value-object/user-status");
const VerifyTokenType = require("./value-object/verify-token-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_login_his", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_ip: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(1024),
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 