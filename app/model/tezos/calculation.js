module.exports = (sequelize, DataTypes) => {
  return sequelize.define("calculations", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    cycle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    ratio: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    fee_ratio: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    fee_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    fee_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    payable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    skipped: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    atphase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });

};
