const Model = require("app/model/staking").roles;

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      name: "Admin"
    }, {
      name: "Operator"
    }], {
        returning: true
      });
  }
})();