const logger = require('app/lib/logger');
const DistributeCommissionCfg = require("app/model/staking").distribute_commission_cfgs;
const DistributeCommissionCfgHis = require("app/model/staking").distribute_commission_cfgs_his;
const config = require('app/config');
const database = require('app/lib/database').db().staking;
const mapper = require('app/feature/response-schema/distribute-commission-cfg.response-schema');

module.exports = {
  get: async (req, res, next) => {
    try {
      const { query: { offset, limit } } = req;
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: items } = await DistributeCommissionCfg.findAndCountAll({ offset: off, limit: lim, order: [['platform', 'ASC']] });
      return res.ok({
        items: mapper(items),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get distribute commission config fail: ", err);
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const { query: { offset, limit } } = req;
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: items } = await DistributeCommissionCfgHis.findAndCountAll({ offset: off, limit: lim, order: [['updatedAt', 'DESC']] });
      return res.ok({
        items: mapper(items),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get distribute commission history config fail: ", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    const transaction = await database.transaction();
    try {
      logger.info('distribute-commission::update');
      const { body: { items }, user } = req;
      let results = [];
      for (let item of items) {
        item.updated_by = user.id;
        let [_, updatedCommission] = await DistributeCommissionCfg.update(item, {
          where: {
            id: item.id
          }, returning: true
        }, { transaction });
        results.push(updatedCommission);
      }
      logger.info('distribute-commission::update::distribute-commission::', JSON.stringify(results));
      await transaction.commit();
      return res.ok(mapper(results));
    } catch (error) {
      logger.error(error);
      if (transaction) await transaction.rollback();
      next(error);
    }
  }
}