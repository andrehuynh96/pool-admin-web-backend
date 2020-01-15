const Temporal = require('sequelize-temporal');
module.exports = (sequelize, DataTypes) => {
  const partner_commission = sequelize.define("partner_commissions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    partner_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    commission: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    reward_address: {
      type: DataTypes.STRING(128),
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
  Temporal(partner_commission, sequelize, { blocking: true, full: false });  
  return partner_commission;
}