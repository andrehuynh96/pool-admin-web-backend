const logger = require('app/lib/logger');
const stakingPayout = require("app/model/staking").staking_payouts;
const ERC20EventPool = require("app/model/staking").erc20_event_pools;
const database = require('app/lib/database').db().staking;
const constructTxData = require("app/lib/locking-contract");

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
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      let { staking_platform_id: platformId, id: payoutId } = req.params;
      let payout = await stakingPayout.findOne({
        where: {
          id: payoutId,
          staking_platform_id: platformId
        }
      })
      if (!payout) return res.badRequest(res.__("NOT_FOUND"), "NOT_FOUND");
      if (payout.wait_blockchain_confirm_status_flg)
        return res.badRequest(res.__("PLATFORM_IS_UNDER_BLOCKCHAIN_CONFIRMATION"), "PLATFORM_IS_UNDER_BLOCKCHAIN_CONFIRMATION");

      if (req.user) {
        req.body.updated_by = req.user.id;
      }

      let { tx_raw, tx_id } = await constructTxData.updateStakingMaxPayout(
        platformId,
        req.body.max_payout,
        payout.token_address
      );
      tx_id = '0x' + tx_id;
      console.log(tx_id);

      transaction = await database.transaction();
      
      let [_, response] = await stakingPayout.update({
        wait_blockchain_confirm_status_flg: true,
        tx_id: tx_id
      }, {
        where: {
          id: payout.id
        },
        returning: true
      }, { transaction })

      let newEvent = {
        name: 'UPDATE_STAKING_PAYOUT',
        description: 'Update staking platform max payout id ' + payout.id,
        tx_id: tx_id,
        updated_by: req.user.id,
        created_by: req.user.id,
        successful_event: `UPDATE public.staking_payouts SET wait_blockchain_confirm_status_flg = false, max_payout = ${req.body.max_payout} WHERE id = ${payout.id}`,
        fail_event: `UPDATE public.staking_payouts SET wait_blockchain_confirm_status_flg = false WHERE id = ${payout.id}`
      };
      let createERC20EventResponse = await ERC20EventPool.create(newEvent, { transaction });

      await transaction.commit();
      return res.ok(response[0]);
    }
    catch (err) {
      logger.error("update max payout fail: ", err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  }
}