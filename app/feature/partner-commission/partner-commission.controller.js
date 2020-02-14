const logger = require('app/lib/logger');
const config = require('app/config');
const PartnerCommission = require('app/model/staking').partner_commissions;
const History = require('app/model/staking').partner_commissions_histories;
const mapper = require('app/feature/response-schema/partner-commission.response-schema');
const database = require('app/lib/database').db().staking;
var commission = {};

commission.all = async (req, res, next) => {
  try {
    logger.info('partner-commission::all');
    const { query: { offset, limit }, params: { partner_id } } = req;
    const where = { partner_id: partner_id };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partner_commissions } = await PartnerCommission.findAndCountAll({offset: off, limit: lim, where: where, order: [['platform', 'ASC']]});
    return res.ok({
      items: partner_commissions.map(item => mapper(item)),
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
        let [_ , updatedCommission] = await PartnerCommission.update(item, { where: {
          id: item.id
        }, returning: true }, { transaction });
        updatedCommissions.push(updatedCommission);
      }
    }
    let insertedCommissions = await PartnerCommission.bulkCreate(insertedItems, { transaction });
    let partner_commissions =  insertedCommissions.concat(updatedCommissions);
    logger.info('partner-commission::update::partner-commission::', JSON.stringify(partner_commissions));
    await transaction.commit();
    return res.ok(partner_commissions.map(item => mapper(item)));
  } catch (error) {
    logger.error(error);
    await transaction.rollback();
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
    const { count: total, rows: partner_commissions_histories } = await History.findAndCountAll({offset: off, limit: lim, where: where, order: [['platform', 'ASC']]});
    return res.ok({
      items: partner_commissions_histories.map(item => mapper(item)),
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
