const Model = require("app/model/staking").settings;

module.exports = async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      key: "LOCKING_CONTRACT",
      value: ""
    }], {
        returning: true
      });
  }
};