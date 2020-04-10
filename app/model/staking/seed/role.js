const Model = require("app/model/staking").roles;

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      name: "Master"
    }, {
      name: "Admin"
    }, {
      name: "Operator1"
    }, {
      name: "Operator2"
    }], {
      returning: true
    });
  }
})();