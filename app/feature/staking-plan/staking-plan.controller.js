const logger = require('app/lib/logger');
const StakingPlan = require("app/model/staking").staking_plans;

module.exports = {
  getPlans: async (req, res, next) => {
    try {
      let size = req.query.limit || 20
      let page = req.query.page || 1
      let platformId = req.params.staking_platform_id
      let total = await StakingPlan.count({
        staking_platform_id: platformId
      })
      let plans = await StakingPlan.findAll({
        where: {
          staking_platform_id: platformId
        },
        offset: (page - 1) * size,
        limit: size,
        raw: true
      });
      return res.ok({
        size: size,
        page: page,
        total: total,
        plans: plans
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
      console.log(err)
      logger.error("update staking plan fail: ", err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      let plan = req.body
      plan.staking_platform_id = platformId
      await StakingPlan.create(plan)
      return res.ok(true);
    }
    catch (err) {
      logger.error("create staking plan fail: ", err);
      next(err);
    }
  }
}