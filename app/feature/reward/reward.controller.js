const logger = require('app/lib/logger');
const StakingRewardCfg = require("app/model/staking").staking_reward_cfgs;
const StakingRewardCfgHis = require("app/model/staking").staking_reward_cfg_his;
const config = require('app/config');

module.exports = {
  get: async (req, res, next) => {
    try {
      const { query: { offset, limit}} = req;
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: items } = await StakingRewardCfg.findAndCountAll({offset: off, limit: lim, order: [['platform', 'ASC']]});
      return res.ok({
        items: items,
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get staking reward config fail: ", err);
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const { query: { offset, limit}} = req;
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);
      
      const { count: total, rows: items } = await StakingRewardCfgHis.findAndCountAll({offset: off, limit: lim, order: [['platform', 'ASC']]});
      return res.ok({
        items: items,
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get staking reward config history fail: ", err);
      next(err);
    }
  }
}