const logger = require('app/lib/logger');
const StakingRewardCfg = require("app/model/staking").staking_reward_cfgs;

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

  update: async (req, res, next) => {
    try {
      let cfgs = req.body

      for (let cfg of cfgs) {
        await StakingRewardCfg.update({
          commission: cfg.commission,
        }, {
            where: {
              id: cfg.id
            },
            returning: true
          })
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error("update staking reward config fail: ", err);
      next(err);
    }
  }
}