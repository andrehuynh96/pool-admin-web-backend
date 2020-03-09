const CheckErc20EventSchedule = require("./check-erc20-event.schedule");

module.exports = {
  start: () => {
    CheckErc20EventSchedule.run();
  }
}