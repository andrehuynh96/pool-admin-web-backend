const Model = require("app/model/staking").roles;
const bcrypt = require('bcrypt');

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      name: "Admin"
    }], {
        returning: true
      });
  }
})();