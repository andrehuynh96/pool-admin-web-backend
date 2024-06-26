
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("iris_accounts", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    block_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    partner_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    pre_balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    pre_block_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    balance_change: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 