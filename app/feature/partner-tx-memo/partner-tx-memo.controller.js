const logger = require('app/lib/logger');
const config = require('app/config');
const TxMemo = require('app/model/staking').partner_tx_memos;
const mapper = require('app/feature/response-schema/partner-tx-memo.response-schema');
const database = require('app/lib/database').db().staking;
const { _getUsername } = require('app/lib/utils');
const StakingPlatform = require("app/model/staking").staking_platforms;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var memo = {};

memo.all = async (req, res, next) => {
  try {
    logger.info('partner-tx-memo::all');
    const { query: { offset, limit }, params: { partner_id } } = req;
    const where = { partner_id: partner_id, default_flg: true };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partner_tx_memos } = await TxMemo.findAndCountAll({ offset: off, limit: lim, where: where, order: [['platform', 'ASC']] });
    let result = await _getUsername(partner_tx_memos);
    let platforms = result.map(x => x.platform);
    let defaultPlatfrom = await _getPlatform(platforms);
    result = result.concat(defaultPlatfrom);
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


memo.create = async (req, res, next) => {
  const transaction = await database.transaction();
  try {
    logger.info('partner-tx-memo::update');
    const { params: { partner_id }, body: { items }, user } = req;
    let updatedItems = [];
    let insertedItems = [];
    for (let item of items) {
      let condition = {
        partner_id: partner_id,
        platform: item.platform,
        default_flg: true
      };
      let txMemo = await TxMemo.findOne({ where: condition });
      condition.memo = item.memo;
      let existMemo = await TxMemo.findOne({ where: condition });
      if (!existMemo) {
        item.created_by = user.id;
        item.updated_by = user.id;
        item.partner_id = partner_id;
        insertedItems.push(item);
        if (txMemo && txMemo.id) updatedItems.push(txMemo.id);
      }
    }
    let partner_tx_memos = await TxMemo.bulkCreate(insertedItems, { transaction });
    await TxMemo.update({
      default_flg: false,
      updated_by: user.id,
      partner_updated_by: null
    }, {
        where: {
          id: updatedItems
        }
      }, { transaction });
    logger.info('partner-tx-memo::update::partner-tx-memo::', JSON.stringify(partner_tx_memos));
    await transaction.commit();
    let result = await _getUsername(partner_tx_memos);
    return res.ok({
      items: mapper(result)
    });
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    next(error);
  }
};

memo.getHis = async (req, res, next) => {
  try {
    logger.info('partner-tx-memo::all::histories');
    const { query: { offset, limit }, params: { partner_id } } = req;
    const where = { partner_id: partner_id, default_flg: false };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    const { count: total, rows: partner_tx_memos } = await TxMemo.findAndCountAll({ offset: off, limit: lim, where: where, order: [['platform', 'ASC']] });
    let result = await _getUsername(partner_tx_memos);
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

async function _getPlatform(platformDefaults = []) {
  let platforms = await StakingPlatform.findAll({
    where: {
      deleted_flg: false,
      using_memo_flg: true,
      platform: {
        [Op.notIn]: platformDefaults
      }
    }
  });
  if (platforms && platforms.length > 0) {
    platforms = platforms.map(x => {
      return {
        platform: x.platform,
        memo: "",
        id: x.id
      }
    });
    return platforms;
  }

  return [];
}

module.exports = memo;
