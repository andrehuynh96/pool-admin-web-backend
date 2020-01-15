const logger = require('app/lib/logger');
const config = require('app/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const ApiKey = require('app/model/staking').api_keys;
const mapper = require('app/feature/response-schema/partner-api-key.response-schema');

var key = {};

key.all = async (req, res, next) => {
  try {
    logger.info('api key::all');
    const { query: { offset, limit, actived_flg} } = req;
    const where = { };
    if (actived_flg) {
      where.actived_flg = actived_flg;
    }
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partners } = await ApiKey.findAndCountAll({lim, off, where: where, order: [['updatedAt', 'DESC']]});
    return res.ok({
      items: partners.map(item => mapper(item)),
      offset: off,
      limit: lim,
      total: total
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

key.create = async (req, res, next) => {
  try {
    logger.info('api key::create');
    req.body.created_by = req.user;
    req.body.updated_by = req.user;
    let partner = await ApiKey.create(req.body);
    return res.ok(mapper(partner));
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

key.delete = async (req, res, next) => {
  try {
    logger.info('api key::delete');
    const { params: { partner_id }, user} = req; 
    await ApiKey.update({deleted_flg : true, updated_by: user}, {where: {id: partner_id}});
    return res.ok({deleted: true});
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = partner;
