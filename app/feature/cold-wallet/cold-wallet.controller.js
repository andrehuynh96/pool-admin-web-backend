const logger = require('app/lib/logger');
const config = require('app/config');
const ColdWallet = require('app/model/staking').cold_wallets;
const bech32 = require("bech32");
const WAValidator = require("wallet-address-validator");

module.export = {
    create: async (req, res, next) => {
        const transaction;
        try {
        logger.info('cold-wallet::update');
        const { body: { items }, user } = req;
        let checkAddressMessage = _checkListAddress(items);
        if (checkAddressMessage.length > 0) {
            return res.badRequest(checkAddressMessage);
        }
        transaction = await database.transaction();
        let updatedCommissions = [];
        for (let item of items) {
            item.updated_by = user.id;
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
        
        logger.info('cold-wallets::update::cold-wallets::', JSON.stringify(updatedCommissions));
        await transaction.commit();
        return res.ok(mapper(updatedCommissions));
        } catch (error) {
        logger.error(error);
        if (transaction) await transaction.rollback();
        next(error);
        }
    }
}

function _checkListAddress(data) {
    let errorMessage = "";
    if (data && data.length > 0) {
      for (let e of data) {
        if (e.id) {
          continue;
        }
        if (!e.reward_address) {
          continue;
        }
        let valid = false;
        if (e.platform == "ATOM") {
          valid = _verifyCosmosAddress(e.reward_address);
        } else if (e.platform == "IRIS") {
          valid = _verifyIrisAddress(e.reward_address);
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