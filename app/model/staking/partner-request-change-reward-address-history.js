const Status = require("./value-object/request-change-reward-address-status");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("partner_request_change_reward_addresses_his", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    partner_commission_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    reward_address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Status.DRAFT
    },
    email_confirmed: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    verify_token: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });

}