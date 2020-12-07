module.exports = (sequelize, DataTypes) => {
  return sequelize.define("distribute_commissions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    withdrawal_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    commission_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    number_client: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    from_block: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    to_block: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cycle: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cycle_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
};
