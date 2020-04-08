const TrackingVoteType = require("./value-object/tracking-vote-type");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tracking_votes", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    voter_address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tx_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    memo: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: TrackingVoteType.DELEGATE
    },
    balance: {
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