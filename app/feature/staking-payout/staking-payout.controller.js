const logger = require('app/lib/logger');
const stakingPayout = require("app/model/staking").erc20_staking_payouts;
module.exports = {
  get: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      let payouts = await stakingPayout.findAll({
        where: {
          staking_platform_id: platformId
        }
      })
      return res.ok(payouts)
    }
    catch (err) {
      logger.error("get payout fail: ", err);
      next(err);
    }
  }
}