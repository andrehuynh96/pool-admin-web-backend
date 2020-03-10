const logger = require('app/lib/logger');
const stakingPayout = require("app/model/staking").erc20_staking_payouts;
module.exports = {
  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;

      let { count: total, rows: items } = await stakingPayout.findAndCountAll({
        limit,
        offset
      })
      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error("get payout fail: ", err);
      next(err);
    }
  }
}