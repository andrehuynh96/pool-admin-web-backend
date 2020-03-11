const logger = require('app/lib/logger');
const StakingPlan = require("app/model/staking").erc20_staking_plans;
const config = require('app/config');

module.exports = {
  getPlans: async (req, res, next) => {
    try {
      const { query: { offset, limit}} = req;
      let platformId = req.params.staking_platform_id;
      let where = {staking_platform_id: platformId};
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);
      const { count: total, rows: items } = await StakingPlan.findAndCountAll({offset: off, limit: lim, where: where});
      return res.ok({
        items: items,
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get plans fail: ", err);
      next(err);
    }
  },

  getDetail: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      let planId = req.params.plan_id
      let plan = await StakingPlan.findOne({
        where: {
          staking_platform_id: platformId,
          id: planId
        },
        raw: true
      });
      return res.ok(plan);
    }
    catch (err) {
      logger.error("get plan detail fail: ", err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      let planId = req.params.plan_id
      let plan = req.body
      await StakingPlan.update(plan,
        {
          where: {
            id: planId,
            staking_platform_id: platformId
          },
          returning: true
        })
      return res.ok(true);
    }
    catch (err) {
      logger.error("update staking plan fail: ", err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      
    }
    catch (err) {
      logger.error("create staking plan fail: ", err);
      next(err);
    }
  }
}