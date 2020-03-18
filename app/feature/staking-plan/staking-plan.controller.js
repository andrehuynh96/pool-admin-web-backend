const logger = require('app/lib/logger');
const StakingPlan = require("app/model/staking").erc20_staking_plans;
const StakingPayout = require("app/model/staking").erc20_staking_payouts;
const StakingPlatform = require("app/model/staking").staking_platforms;
const ERC20EventPool = require("app/model/staking").erc20_event_pools;
const config = require('app/config');
const database = require('app/lib/database').db().staking;
const constructTxData = require("app/lib/locking-contract");

module.exports = {
  getPlans: async (req, res, next) => {
    try {
      const { query: { offset, limit } } = req;
      let platformId = req.params.staking_platform_id;
      let where = { staking_platform_id: platformId };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);
      const { count: total, rows: items } = await StakingPlan.findAndCountAll({ offset: off, limit: lim, where: where });
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
    const transaction = await database.transaction();
    try {
      let platformId = req.params.staking_platform_id
      let planId = req.params.plan_id
      let platform = await StakingPlatform.findOne({
        where: {
          id: platformId
        }
      })
      if (!platform) {
        return res.badRequest(res.__("STAKING_PLATFORM_NOT_FOUND"), "STAKING_PLATFORM_NOT_FOUND", { fields: ["staking_platform_id"] });
      }

      let plan = await StakingPlan.findOne({
        where: {
          id: planId
        }
      })
      if (!plan) {
        return res.badRequest(res.__("STAKING_PLAN_NOT_FOUND"), "STAKING_PLAN_NOT_FOUND", { fields: ["plan_id"] });
      }
      if (plan.wait_blockchain_confirm_status_flg) {
        return res.badRequest(res.__("PLAN_IS_UNDER_BLOCKCHAIN_CONFIRMATION"), "PLAN_IS_UNDER_BLOCKCHAIN_CONFIRMATION");
      }

      let { tx_raw, tx_id } = await constructTxData.updateStakingPlan(
        plan.id,
        req.body.status
      )
      tx_id = '0x' + tx_id;

      await StakingPlan.update({
        wait_blockchain_confirm_status_flg: true,
        tx_id: tx_id
      }, {
        where: {
          id: planId
        }
      }, { transaction })

      //Create event pool
      let newEvent = {
        name: 'UPDATE_ERC20_STAKING_PLAN',
        description: 'Update ERC20 staking plan id ' + plan.id,
        tx_id: tx_id,
        updated_by: req.user.id,
        created_by: req.user.id,
        successful_event: `UPDATE public.erc20_staking_plans SET wait_blockchain_confirm_status_flg = false, name= '${req.body.name}', status = ${req.body.status} , tx_id = '${tx_id}' WHERE id = '${plan.id}'`,
        fail_event: `UPDATE public.erc20_staking_plans SET wait_blockchain_confirm_status_flg = false WHERE id = '${plan.id}'`
      };


      let createERC20EventResponse = await ERC20EventPool.create(newEvent, { transaction });
      if (!createERC20EventResponse) {
        await transaction.rollback();
        return res.serverInternalError();
      }
      await transaction.commit();
      return res.ok(true)
    }
    catch (err) {
      logger.error("update staking plan fail: ", err);
      await transaction.rollback();
      next(err);
    }
  },

  create: async (req, res, next) => {
    const transaction = await database.transaction();
    try {
      let platformId = req.params.staking_platform_id
      let platform = await StakingPlatform.findOne({
        where: {
          id: platformId
        }
      })
      if (!platform) {
        return res.badRequest(res.__("STAKING_PLATFORM_NOT_FOUND"), "STAKING_PLATFORM_NOT_FOUND", { fields: ["staking_platform_id"] });
      }
      let payout = await StakingPayout.findOne({
        where: {
          staking_platform_id: platformId
        }
      })
      if (!payout) {
        return res.badRequest(res.__("STAKING_PAYOUT_NOT_FOUND"), "STAKING_PAYOUT_NOT", { fields: ["staking_platform_id"] });
      }
      planParams = {
        ...req.body,
        staking_platform_id: platform.id,
        erc20_staking_payout_id: payout.id,
        reward_diff_token_flg: false,
        diff_token_rate: 0,
        wait_blockchain_confirm_status_flg: true
      }
      // INSERT staking-plan
      let createPlanResponse = await StakingPlan.create(planParams, { transaction })
      if (!createPlanResponse) {
        await transaction.rollback();
        return res.serverInternalError();
      }
      let durationTime = { timeNumber: planParams.duration, type: planParams.duration_type }
      let { tx_raw, tx_id } = await constructTxData.createStakingPlan(
        planParams.staking_platform_id,
        createPlanResponse.id,
        durationTime,
        planParams.reward_percentage
      )
      tx_id = '0x' + tx_id;

      // INSERT event pool
      let newEvent = {
        name: 'CREATE_NEW_ERC20_STAKING_PLAN',
        description: 'Create new ERC20 staking plan id ' + createPlanResponse.id,
        tx_id: tx_id,
        updated_by: req.user.id,
        created_by: req.user.id,
        successful_event: `UPDATE public.erc20_staking_plans SET wait_blockchain_confirm_status_flg = false, status = ${planParams.status}, tx_id = '${tx_id}' WHERE id = '${createPlanResponse.id}' `,
        fail_event: `DELETE FROM public.erc20_staking_plans where id = '${createPlanResponse.id}'`
      };
      let createERC20EventResponse = await ERC20EventPool.create(newEvent, { transaction });
      if (!createERC20EventResponse) {
        await transaction.rollback();
        return res.serverInternalError();
      }
      await transaction.commit();
      await StakingPlan.update({
        wait_blockchain_confirm_status_flg: true,
        tx_id: tx_id
      }, {
        where: {
          id: createPlanResponse.id
        }
      }, { transaction })
      return res.ok(true);
    }
    catch (err) {
      logger.error("create staking plan fail: ", err);
      await transaction.rollback();
      next(err);
    }
  }
}