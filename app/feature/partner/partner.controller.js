const logger = require('app/lib/logger');
const config = require('app/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Partner = require('app/model/staking').partners;
const mapper = require('app/feature/response-schema/partner.response-schema');

var partner = {};

partner.all = async (req, res, next) => {
  try {
    logger.info('partner::all');
    const { query: { offset, limit, name, email, actived_flg, root} } = req;
    const where = { deleted_flg: false};
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (email) {
      where.email = { [Op.iLike]: `%${email}%` };
    }
    if (actived_flg) {
      where.actived_flg = actived_flg;
    }
    if (root && (root == 1 || root == true || root == 'true')) {
      where.parent_id = { [Op.eq]: null };
    }
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);

    const { count: total, rows: partners } = await Partner.findAndCountAll({ offset: off, limit: lim, where: where, order: [['updatedAt', 'DESC']] });
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

partner.create = async (req, res, next) => {
  try {
    let child = await Partner.findOne({
      where: {
        email: req.body.email
      }
    })
    if(child){
      return res.badRequest(res.__("EMAIL_EXIST_ALREADY"), "EMAIL_EXIST_ALREADY", { fields: ['email'] });
    }
    logger.info('partner::create');
    req.body.created_by = req.user.id;
    req.body.updated_by = req.user.id;
    let partner = await Partner.create(req.body);
    return res.ok(mapper(partner));
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

partner.update = async (req, res, next) => {
  try {
    logger.info('partner::update');
    const { params: { partner_id }, body } = req;
    body.updated_by = req.user.id;
    let [_, partner] = await Partner.update(body, { where: { id: partner_id }, returning: true });
    logger.info('partner::update::partner::', JSON.stringify(partner));
    return res.ok(mapper(partner));
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

partner.get = async (req, res, next) => {
  try {
    logger.info('partner::get');
    const { params: { partner_id } } = req;
    let partner = await Partner.findOne({ where: { id: partner_id, deleted_flg: false } });
    if (!partner) {
      return res.badRequest();
    } else {
      return res.ok(mapper(partner));
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

partner.delete = async (req, res, next) => {
  try {
    logger.info('partner::delete');
    const { params: { partner_id }, user } = req;
    await Partner.update({ deleted_flg: true, updated_by: user.id }, { where: { id: partner_id } });
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = partner;
