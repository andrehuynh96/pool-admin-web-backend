
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("roles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
  Role.associate = (models) => {
    // associations can be defined here
    Role.hasMany(models.user_roles, {foreignKey: 'user_id'})
  };
  return Role;
} 