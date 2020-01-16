const logger = require('app/lib/logger');
const StakingRewardCfg = require("app/model/staking").staking_reward_cfgs;
const StakingRewardCfgHis = require("app/model/staking").staking_reward_cfg_his

module.exports = {
  get: async (req, res, next) => {
    try {
      let rewardCfg = await StakingRewardCfg.findAll({
        raw: true
      });
      return res.ok(rewardCfg);
    }
    catch (err) {
      logger.error("get staking reward config fail: ", err);
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      let size = req.query.limit || 20
      let page = req.query.page || 1
      let total = await StakingRewardCfgHis.count()
      let rewardCfg = await StakingRewardCfgHis.findAll({
        offset: (page - 1) * size,
        limit: size,
        raw: true
      });
      return res.ok({
        size: size,
        page: page,
        total: total,
        his: rewardCfg
      });
    }
    catch (err) {
      logger.error("update staking reward config fail: ", err);
      next(err);
    }
  }
}