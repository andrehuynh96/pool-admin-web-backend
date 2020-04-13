const Role = require("app/model/staking").roles;
const User = require("app/model/staking").users;
const UserRole = require("app/model/staking").user_roles;

(async () => {
  let adminRole = await Role.findOne({
    where: {
      name: "Master"
    }
  });
  let user = await User.findOne({
    where: {
      email: "admin@gmail.com"
    }
  });

  if (user && adminRole) {
    let roleUser = await UserRole.findOne({
      where: {
        user_id: user.id,
        role_id: adminRole.id,
      }
    });

    if (!roleUser) {
      await UserRole.create({
        user_id: user.id,
        role_id: adminRole.id,
      })
    }
  }
})();