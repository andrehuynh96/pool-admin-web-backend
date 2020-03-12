const logger = require('app/lib/logger');
const StakingPlan = require("app/model/staking").erc20_staking_plans;
const StakingPayout = require("app/model/staking").erc20_staking_payouts;
const StakingPlatform = require("app/model/staking").staking_platforms;
const ERC20EventPool = require("app/model/staking").erc20_event_pools;
const config = require('app/config');
const database = require('app/lib/database').db().staking;
const axios = require("axios");
const Transaction = require('ethereumjs-tx').Transaction;
const InfinitoApi = require('node-infinito-api');
const Web3 = require('web3');
const Eth = require('web3-eth');

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/ccb2e224843840dc99f3261937eb1900"));
const eth = new Eth(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/ccb2e224843840dc99f3261937eb1900"));

const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secret,
  baseUrl: config.sdk.url
}; 
const api = new InfinitoApi(opts);
let coinAPI = api.ETH;
let privKey = Buffer.from('a5fbd094cc939973432d5440739e28cba132701730583218641ab3d90aba8360', 'hex');
let myAddress = '0x5c1e0136B1D5781C9a5978e7dd059158Eb895BBB';

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
      const transaction = await database.transaction();
      let platform = await StakingPlatform.findOne({
        where: {
          id: platformId
        }
      })
      if(!platform) {
        return res.badRequest(res.__("STAKING_PLATFORM_NOT_FOUND"), "STAKING_PLATFORM_NOT_FOUND", { fields: ["staking_platform_id"] });
      }

      let plan = await StakingPlan.findOne({
        where: {
          id: planId
        }
      })
      if(!plan) {
        return res.badRequest(res.__("STAKING_PLAN_NOT_FOUND"), "STAKING_PLAN_NOT_FOUND", { fields: ["plan_id"] });
      }
      if(plan.wait_blockchain_confirm_status_flg){
        return res.badRequest(res.__("PLAN_IS_UNDER_BLOCKCHAIN_CONFIRMATION"), "PLAN_IS_UNDER_BLOCKCHAIN_CONFIRMATION");
      }
      //
      await StakingPlan.update({
        wait_blockchain_confirm_status_flg: true
      },{
        where: {
          id: planId
        }
      },{transaction})
      //Update hardcode no call blockchain
      let newEvent = {
        name: 'UPDATE_ERC20_STAKING_PLAN',
        description: 'Update ERC20 staking plan id ' + plan.id,
        tx_id: '',
        updated_by: req.user.id,
        created_by: req.user.id,
        successful_event: `UPDATE public.staking_plans SET wait_blockchain_confirm_status_flg = false, name= '${req.body.name}', status = ${req.body.status} , tx_id = ${1} WHERE id = '${plan.id}'`,
        fail_event: `UPDATE public.staking_plans SET wait_blockchain_confirm_status_flg = false WHERE id = '${plan.id}'`
      };
      let createERC20EventResponse = await ERC20EventPool.create(newEvent,{ transaction });
      if(!createERC20EventResponse) {
        await transaction.rollback();
        return res.serverInternalError();
      }
      await transaction.commit();
      return res.ok(true)
    }
    catch (err) {
      logger.error("update staking plan fail: ", err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      let platformId = req.params.staking_platform_id
      const transaction = await database.transaction();
      let platform = await StakingPlatform.findOne({
        where: {
          id: platformId
        }
      })
      if(!platform) {
        return res.badRequest(res.__("STAKING_PLATFORM_NOT FOUND"), "STAKING_PLATFORM_NOT_FOUND", { fields: ["staking_platform_id"] });
      }
      let payout = await StakingPayout.findOne({
        where: {
          staking_platform_id: platformId
        }
      })
      if(!payout) {
        return res.badRequest(res.__("STAKING_PAYOUT_NOT FOUND"), "STAKING_PAYOUT_NOT", { fields: ["staking_platform_id"] });
      }

      // let getAddressUrl = `${config.txCreator.host}/api/sign/${config.txCreator.ETH.keyId}/${platform.symbol}/address/0`;
      // let address = await axios.get(getAddressUrl, {
      //   params: {
      //     testnet: config.txCreator.ETH.testNet
      //   }
      // });
      // address = address.data.data.address;
      // let balance = await eth.getBalance(myAddress);
      // console.log(address);
      // console.log('Account balance:', balance);
      // let transaction = new Transaction();
      // const txParams = {
      //   nonce: await eth.getTransactionCount(address),
      //   gasPrice: config.txCreator.ETH.fee,
      //   gasLimit: config.txCreator.ETH.gasLimit,
      //   from: address,
      //   to: myAddress,
      //   value: '0x100',
      //   data: '0x'
      // };
      // console.log(txParams);
      // tx = new Transaction(txParams, { chain: 'ropsten', hardfork: 'petersburg' });
      // console.log('0x' + tx.serialize().toString('hex'));
      // tx.sign(privKey);
      
      // var serializedTx = tx.serialize();
      // console.log(tx.validate());
      //SET PARAMS FOR staking-plan
      planParams = {
        ...req.body,
        staking_platform_id : platform.id,
        erc20_staking_payout_id : payout.id,
        reward_diff_token_flg : false,
        diff_token_rate : 0,
        wait_blockchain_confirm_status_flg : true
      }
      // INSERT staking-plan
      let createPlanResponse = await StakingPlan.create(planParams,{ transaction })
      if(!createPlanResponse) {
        await transaction.rollback();
        return res.serverInternalError();
      }

      // INSERT event pool
      let newEvent = {
        name: 'CREATE_NEW_ERC20_STAKING_PLAN',
        description: 'Create new ERC20 staking plan id ' + createPlanResponse.id,
        tx_id: '',
        updated_by: req.user.id,
        created_by: req.user.id,
        successful_event: `UPDATE public.staking_plans SET wait_blockchain_confirm_status_flg = false, status = ${planParams.status}, tx_id = ${1} WHERE id = '${createPlanResponse.id}' `,
        fail_event: `DELETE FROM public.staking_plans where id = '${createPlanResponse.id}'`
      };
      let createERC20EventResponse = await ERC20EventPool.create(newEvent,{ transaction });
      if(!createERC20EventResponse) {
        await transaction.rollback();
        return res.serverInternalError();
      }
      await transaction.commit();
      return res.ok(true)
    }
    catch (err) {
      logger.error("create staking plan fail: ", err);
      next(err);
    }
  }
}