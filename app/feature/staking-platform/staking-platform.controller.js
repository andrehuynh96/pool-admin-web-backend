const logger = require('app/lib/logger');
const StakingPlatform = require("app/model/staking").staking_platforms;
const TimeUnit = require("app/model/staking/value-object/time-unit");

module.exports = {
  timeUnit: (req, res, next) => {
    try {
      let result = Object.values(TimeUnit);
      return res.ok(result);
    }
    catch (err) {
      logger.error('get timeUnit fail:', err);
      next(err);
    }
  },
  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = { deleted_flg: false };
      if (req.query.staking_type) {
        where.staking_type = req.query.staking_type
      }
      if (req.query.actived_flg != undefined) {
        where.actived_flg = req.query.actived
      }

      const { count: total, rows: items } = await StakingPlatform.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('getAll staking platform fail:', err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      let result = await StakingPlatform.findOne({
        deleted_flg: false,
        id: req.params.id
      })

      if (!result) {
        return res.notFound(res.__("NOT_FOUND"), "NOT_FOUND");
      }

      return res.ok(result);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  }
}
