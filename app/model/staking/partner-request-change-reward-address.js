const Status = require("./value-object/request-change-reward-address-status");
const { Temporalize } = require('sequelize-temporalize');

module.exports = (sequelize, DataTypes) => {
  const  partner_request_change_reward_address = sequelize.define("partner_request_change_reward_addresses", {
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
    partner_request_change_reward_address.associate = (models) => {
      // associations can be defined here
      partner_request_change_reward_address.belongsTo(models.partner_commissions, {foreignKey: 'partner_commission_id'})
    };
   
    Temporalize({
      model: partner_request_change_reward_address,
      sequelize,
      temporalizeOptions: {
        blocking: false,
        full: false,
        modelSuffix: "_his"
      }
    });
  return partner_request_change_reward_address;
}