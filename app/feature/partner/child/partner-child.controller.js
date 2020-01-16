const logger = require('app/lib/logger');
const config = require('app/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Partner = require('app/model/staking').partners;
const mapper = require('app/feature/response-schema/partner.response-schema');

var child = {};

child.all = async (req, res, next) => {
  try {
    logger.info('partner::all');
    const { query: { offset, limit, name, email, actived_flg}, params: { partner_id } } = req;
    const where = { deleted_flg: false, parent_id:  partner_id };
    if (name) {
      where.name = {[Op.iLike]: `%${name}%`};
    }
    if (email) {
      where.email = {[Op.iLike]: `%${email}%`};
    }
    if (actived_flg) {
      where.actived_flg = actived_flg;
    }
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partners } = await Partner.findAndCountAll({offset: off, limit: lim, where: where, order: [['name', 'ASC']]});
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

module.exports = child;