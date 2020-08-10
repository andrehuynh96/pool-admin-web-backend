const Model = require('app/model/staking').cold_wallets;

module.exports = async () => {
  const count = await Model.count();

  if (count == 0) {
    await Model.bulkCreate([{
      platform: "ATOM",
      amount_unit: "uATOM"
    }, {
      platform: "IRIS",
      amount_unit: "uIRIS"
    }], {
      returning: true
    });
  }
};
