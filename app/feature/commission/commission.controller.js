const logger = require('app/lib/logger');
const DistributeCommissionCfg = require("app/model/staking").distribute_commission_cfgs;
const DistributeCommissionCfgHis = require("app/model/staking").distribute_commission_cfg_his;

module.exports = {
  get: async (req, res, next) => {
    try {
      let commissionCfg = await DistributeCommissionCfg.findAll({
        raw: true
      });
      return res.ok(commissionCfg);
    }
    catch (err) {
      logger.error("get distribute commission config fail: ", err);
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      let size = req.query.limit || 20
      let page = req.query.page || 1
      let total = await DistributeCommissionCfgHis.count()
      let commissionCfg = await DistributeCommissionCfgHis.findAll({
        offset: (page - 1) * size,
        limit: size,
        raw: true
      });
      return res.ok({
        size: size,
        page: page,
        total: total,
        his: commissionCfg
      });
    }
    catch (err) {
      logger.error("update distribute commission config fail: ", err);
      next(err);
    }
  }
}