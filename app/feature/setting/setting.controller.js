const logger = require('app/lib/logger');
const Setting = require("app/model/staking").settings;

module.exports = {
    getAll: async (req, res, next) => {
      try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let offset = req.query.offset ? parseInt(req.query.offset) : 0;

        let { count: total, rows: items } = await Setting.findAndCountAll({
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
        logger.error("get setting fail: ", err);
        next(err);
      }
    }
}