
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_roles", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 