const logger = require('app/lib/logger');
const Payout = require("app/model/staking").payout_cfgs;
const WAValidator = require('multicoin-address-validator');
module.exports = {
  get: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let { count: total, rows: items } = await Payout.findAndCountAll({
        limit,
        offset
      })
      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error("get payout fail: ", err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      let payoutId = req.params.id
      let payout = await Payout.findOne({
        where: {
          id: payoutId
        }
      })
      if(!payout){
        return res.badRequest(res.__("PAYOUT_NOT_FOUND"), "PAYOUT_NOT_FOUND", { fields: ["id"] });
      }
      await Payout.update(
        {
          token_name: req.body.token_name,
          token_symbol: req.body.token_symbol,
          activate_flg: req.body.activate_flg
        },
        {
          where:
          { 
            id: payout.id
          }
        })
      return res.ok(true);
    }
    catch (err) {
      logger.error("update payout fail: ", err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      let payoutCfgs = req.body
      let valid = WAValidator.validate(payoutCfgs.token_address, payoutCfgs.platform);
      if(!valid){
        return res.badRequest(res.__("TOKEN_ADDRESS_INVALID"), "TOKEN_ADDRESS_INVALID", { fields: ["token_address"] });
      }
      let payout = await Payout.findOne({
        where: {
          token_address: payoutCfgs.token_address
        }
      })
      if(payout){
        return res.badRequest(res.__("TOKEN_ADDRESS_EXISTS_ALREADY"), "TOKEN_ADDRESS_EXISTS_ALREADY", { fields: ["token_address"] });
      }
      let payoutToken = await Payout.create({
        ...payoutCfgs,
        created_by: req.user.id
      })
      if(!payoutToken){
        return res.serverInternalError();
      }
      return res.ok(true);
    }
    catch (err) {
      logger.error("create payout  fail: ", err);
      next(err);
    }
  }
}