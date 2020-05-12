const logger = require('app/lib/logger');
const config = require('app/config');
const PartnerCommission = require('app/model/staking').partner_commissions;
const History = require('app/model/staking').partner_commissions_his;
const StakingPlatform = require("app/model/staking").staking_platforms;
const StakingPlatformStatus = require("app/model/staking/value-object/staking-platform-status");
const mapper = require('app/feature/response-schema/partner-commission.response-schema');
const database = require('app/lib/database').db().staking;
const { Op } = require("sequelize");
const bech32 = require("bech32");
const WAValidator = require("wallet-address-validator");
const NeonCore = require('@cityofzion/neon-core');

const { _getUsername } = require('app/lib/utils');
var commission = {};

commission.all = async (req, res, next) => {
  try {
    logger.info('partner-commission::all');
    const { query: { offset, limit }, params: { partner_id } } = req;
    const where = { partner_id: partner_id };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);
    let { count: total, rows: partner_commissions } = await PartnerCommission.findAndCountAll({ offset: off, limit: lim, where: where, order: [['platform', 'ASC']] });

    let stakingPlatformIds = [];
    if (partner_commissions && partner_commissions.length > 0) {
      partner_commissions = await _getUsername(partner_commissions);
      stakingPlatformIds = partner_commissions.map(x => x.staking_platform_id);
      partner_commissions = await _getSymbol(partner_commissions, stakingPlatformIds);
    }
    let defaultPlatfrom = await _getPlatformNotConfig(stakingPlatformIds);
    let result = partner_commissions.concat(defaultPlatfrom);

    return res.ok({
      items: result && result.length > 0 ? mapper(result) : [],
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
  let transaction;
  try {
    logger.info('partner-commission::update');
    const { params: { partner_id }, body: { items }, user } = req;
    let checkAddressMessage = _checkListAddress(items);
    if (checkAddressMessage.length > 0) {
      return res.badRequest(checkAddressMessage);
    }
    transaction = await database.transaction();
    let updatedCommissions = [];
    let insertedItems = [];
    for (let item of items) {
      if (!item.id) {
        if (item.id == null || item.id == "") {
          delete item.id;
        }
        item.created_by = user.id;
        item.updated_by = user.id;
        item.partner_id = partner_id;
        if (item.reward_address) {
          insertedItems.push(item);
        }
      } else {
        item.updated_by = user.id;
        item.partner_updated_by = null;
        let allowedField = ['updated_by', 'partner_updated_by', 'commission'];
        let filteredItem = Object.keys(item)
          .filter(key => allowedField.includes(key))
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {});
        let [_, updatedCommission] = await PartnerCommission.update(filteredItem, {
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

    if (partner_commissions && partner_commissions.length > 0) {
      let stakingPlatformIds = partner_commissions.map(x => x.staking_platform_id);
      partner_commissions = await _getSymbol(partner_commissions, stakingPlatformIds);
    }
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
    let { count: total, rows: partner_commissions_his } = await History.findAndCountAll({ offset: off, limit: lim, where: where, order: [['updated_at', 'DESC']] });

    if (partner_commissions_his && partner_commissions_his.length > 0) {
      let stakingPlatformIds = partner_commissions_his.map(x => x.staking_platform_id);
      partner_commissions_his = await _getSymbol(partner_commissions_his, stakingPlatformIds);
    }
    let result = await _getUsername(partner_commissions_his);
    return res.ok({
      items: result && result.length > 0 ? mapper(result) : [],
      offset: off,
      limit: lim,
      total: total
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const _getPlatformNotConfig = async (stakingPlatformIds) => {
  let result = await StakingPlatform.findAll({
    attributes: ['id', 'platform', 'symbol', 'symbol'],
    where: {
      id: {
        [Op.notIn]: stakingPlatformIds
      },
      status: StakingPlatformStatus.ENABLED
    }
  })

  if (result && result.length > 0) {
    result = result.map(x => {
      return {
        id: "",
        commission: 0,
        reward_address: "",
        staking_platform_id: x.id,
        platform: x.platform,
        symbol: x.symbol,
      }
    });
    return result;
  }

  return [];
}


function _checkListAddress(data) {
  let errorMessage = "";
  if (data && data.length > 0) {
    for (let e of data) {
      if (e.id) {
        continue;
      }
      if (!e.reward_address && e.commission == 0) {
        continue;
      }
      let valid = false;
      if (e.platform == "ATOM") {
        valid = _verifyCosmosAddress(e.reward_address);
      } else if (e.platform == "IRIS") {
        valid = _verifyIrisAddress(e.reward_address);
      } else if (e.platform == "ONT" || e.platform == "ONG") {
        valid = _verifyOntAddress(e.reward_address);
      } else {
        valid = WAValidator.validate(e.reward_address, e.platform, "testnet");
        valid = valid ? true : WAValidator.validate(e.reward_address, e.platform);
      }
      if (!valid) {
        errorMessage = `invalid address of ${e.platform}!`;
        break;
      }
    }
  }
  return errorMessage;
}

const _getSymbol = async (commissions, stakingPlatformIds) => {
  let result = await StakingPlatform.findAll({
    attributes: ['id', 'platform', 'symbol'],
    where: {
      id: {
        [Op.in]: stakingPlatformIds
      }
    }
  });

  for (let e of commissions) {
    let i = result.filter(x => x.id == e.staking_platform_id);
    if (i && i.length > 0) {
      e.symbol = i[0].symbol
    }
  }

  return commissions;
}

function _verifyCosmosAddress(address) {
  try {
    let result = bech32.decode(address.toLowerCase());
    return result.prefix == "cosmos";
  } catch (e) {
    logger.error(e);
    return false;
  }
}

function _verifyIrisAddress(address) {
  try {
    let result = bech32.decode(address.toLowerCase());
    return result.prefix == "iaa";
  } catch (e) {
    logger.error(e);
    return false;
  }
}

function _verifyOntAddress(address) {
  try {
    return NeonCore.wallet.isAddress(address);
  } catch (e) {
    logger.error(e);
    return false;
  }
}

module.exports = commission;
