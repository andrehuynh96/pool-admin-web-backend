const UserStatus = require("./value-object/user-status");
const VerifyTokenType = require("./value-object/verify-token-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    user_sts: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: UserStatus.UNACTIVATED
    },
    verify_token: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    verify_token_type: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: VerifyTokenType.REGISTER
    },
    verify_token_expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    twofa_secret: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: VerifyTokenType.REGISTER
    },
    twofa_enable_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 