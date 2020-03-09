const logger = require('app/lib/logger');
const Payout = require("app/model/staking").erc20_payout_cfgs;

module.exports = {
  get: async (req, res, next) => {
    try {
      return res.ok();
    }
    catch (err) {
      logger.error("get payout fail: ", err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {

      return res.ok(true);
    }
    catch (err) {
      logger.error("update  fail: ", err);
      next(err);
    }
  }
}