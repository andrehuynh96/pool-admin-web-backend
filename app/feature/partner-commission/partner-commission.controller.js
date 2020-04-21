const logger = require('app/lib/logger');
const config = require('app/config');
const PartnerCommission = require('app/model/staking').partner_commissions;
const History = require('app/model/staking').partner_commissions_his;
const mapper = require('app/feature/response-schema/partner-commission.response-schema');
const database = require('app/lib/database').db().staking;
const { _getUsername } = require('app/lib/utils');
var commission = {};

commission.all = async (req, res, next) => {
  try {
    logger.info('partner-commission::all');
    const { query: { offset, limit }, params: { partner_id } } = req;
    const where = { partner_id: partner_id };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partner_commissions } = await PartnerCommission.findAndCountAll({ offset: off, limit: lim, where: where, order: [['platform', 'ASC']] });
    let result = await _getUsername(partner_commissions);
    return res.ok({
      items: mapper(result),
      offset: off,
      limit: lim,
      total: total
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};


commission.create = async (req, res, next) => {
  const transaction = await database.transaction();
  try {
    logger.info('partner-commission::update');
    const { params: { partner_id }, body: { items }, user } = req;
    let updatedCommissions = [];
    let insertedItems = [];
    for (let item of items) {
      if (!item.id) {
        item.created_by = user.id;
        item.updated_by = user.id;
        item.partner_id = partner_id;
        insertedItems.push(item);
      } else {
        item.updated_by = user.id;
        item.partner_updated_by = null;
        let [_, updatedCommission] = await PartnerCommission.update(item, {
          where: {
            id: item.id
          }, returning: true
        }, { transaction });
        updatedCommissions.push(updatedCommission);
      }
    }
    let insertedCommissions = await PartnerCommission.bulkCreate(insertedItems, { transaction });
    let partner_commissions = insertedCommissions.concat(updatedCommissions);
    logger.info('partner-commission::update::partner-commission::', JSON.stringify(partner_commissions));
    await transaction.commit();
    let result = await _getUsername(partner_commissions);
    return res.ok(mapper(result));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    next(error);
  }
};

commission.getHis = async (req, res, next) => {
  try {
    logger.info('partner-commission::all::histories');
    const { query: { offset, limit }, params: { partner_id } } = req;
    const where = { partner_id: partner_id };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partner_commissions_his } = await History.findAndCountAll({ offset: off, limit: lim, where: where, order: [['updated_at', 'DESC']] });
    let result = await _getUsername(partner_commissions_his);
    return res.ok({
      items: mapper(result),
      offset: off,
      limit: lim,
      total: total
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = commission;
