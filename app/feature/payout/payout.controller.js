const logger = require('app/lib/logger');
const ERC20StakingCfg = require("app/model/staking").erc20_staking_cfgs;

module.exports = {
  get: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      let payouts = await ERC20StakingCfg.findAll({
        where: {
          staking_platform_id: platformId
        },
        raw: true
      });
      return res.ok(payouts);
    }
    catch (err) {
      logger.error("get ERC20 staking config fail: ", err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      let cfgs = req.body

      for (let cfg of cfgs) {
        await ERC20StakingCfg.update({
          reward_max_payout: cfg.max_payout,
        }, {
            where: {
              id: cfg.id,
              staking_platform_id: platformId
            },
            returning: true
          })
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error("update ERC20 staking config fail: ", err);
      next(err);
    }
  }
}