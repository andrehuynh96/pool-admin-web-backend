const logger = require('app/lib/logger');
const config = require('app/config');
const ApiKey = require('app/model/staking').partner_api_keys;
const mapper = require('app/feature/response-schema/partner-api-key.response-schema');
const uuidv4 = require('uuid/v4');
const Hashids = require('hashids/cjs');
var key = {};

key.all = async (req, res, next) => {
  try {
    logger.info('api key::all');
    const { query: { offset, limit, actived_flg}, params: { partner_id } } = req;
    const where = { partner_id: partner_id};
    if (actived_flg) {
      where.actived_flg = actived_flg;
    }
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partner_api_keys } = await ApiKey.findAndCountAll({lim, off, where: where, order: [['updatedAt', 'DESC']]});
    return res.ok({
      items: partner_api_keys.map(item => mapper(item)),
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
    const { params: { partner_id }, user, body } = req;
    let data = body;
    data.created_by = user;
    data.partner_id = partner_id;
    data.api_key = uuidv4();
    const hashids = new Hashids(body.name, 32);
    let hash = hashids.encode(Date.now(), Math.floor(Math.random(1000) * 1000 + 1));
    data.secret_key = hash;
    let key = await ApiKey.create(data);
    return res.ok(mapper(key));
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

key.delete = async (req, res, next) => {
  try {
    logger.info('api key::delete');
    const { params: { id }} = req; 
    await ApiKey.update({actived_flg : false }, {where: {id: id}});
    return res.ok({deleted: true});
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = key;
