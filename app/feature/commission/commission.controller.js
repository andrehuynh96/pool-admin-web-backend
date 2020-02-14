const logger = require('app/lib/logger');
const DistributeCommissionCfg = require("app/model/staking").distribute_commission_cfgs;
const DistributeCommissionCfgHis = require("app/model/staking").distribute_commission_cfg_his;
const config = require('app/config');

module.exports = {
  get: async (req, res, next) => {
    try {
      const { query: { offset, limit} } = req;
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: items } = await DistributeCommissionCfg.findAndCountAll({offset: off, limit: lim, order: [['platform', 'ASC']]});
      return res.ok({
        items: items,
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get distribute commission config fail: ", err);
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const { query: { offset, limit} } = req;
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: items } = await DistributeCommissionCfgHis.findAndCountAll({offset: off, limit: lim, order: [['platform', 'ASC']]});
      return res.ok({
        items: items,
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get distribute commission history config fail: ", err);
      next(err);
    }
  }
}