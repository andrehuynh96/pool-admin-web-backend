const PartnerType = require("./value-object/partner-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("partners", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    partner_type: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: PartnerType.CHILD
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    deleted_flg: {
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
}

