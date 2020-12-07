const logger = require('app/lib/logger');
const ColdWallet = require('app/model/staking').cold_wallets;
const User = require("app/model/staking").users;
const bech32 = require("bech32");
const mapper = require('app/feature/response-schema/cold-wallet.response-schema');
const database = require('app/lib/database').db().staking;
const speakeasy = require("speakeasy");
const verifyAddress = require('app/lib/verify-address');

module.exports = {
    update: async (req, res, next) => {
      let transaction;
      try {
        logger.info('cold-wallet::update');
        const { body: { items, twofa_code }, user } = req;
        let result = await User.findOne({
          where: {
            id: user.id
          }
        });
        var verified = speakeasy.totp.verify({
          secret: result.twofa_secret,
          encoding: 'base32',
          token: twofa_code,
        });

        if (!verified) {
          return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_code"] });
        }

        let checkAddressMessage = _checkListAddress(items);
        if (checkAddressMessage.length > 0) {
            return res.badRequest(checkAddressMessage);
        }
        transaction = await database.transaction();
        let coldWallets = [];
        for (let item of items) {
            item.updated_by = user.id;
            let allowedField = ['updated_by', 'reward_address', 'min_amount', 'percenctage',
          'enable_flg'];
            let filteredItem = Object.keys(item)
                .filter(key => allowedField.includes(key))
                .reduce((obj, key) => {
                obj[key] = item[key];
                return obj;
                }, {});
            let [_, coldWallet] = await ColdWallet.update(filteredItem, {
                where: {
                id: item.id
                }, returning: true
            }, { transaction });
            coldWallets.push(coldWallet);
        }

        logger.info('cold-wallets::update::cold-wallets::', JSON.stringify(coldWallets));
        await transaction.commit();
        return res.ok(mapper(coldWallets));
      } catch (error) {
        logger.error(error);
        if (transaction) await transaction.rollback();
        next(error);
      }
    },
    getAll: async (req, res, next) => {
      try {
        logger.info('cold-wallets::all');
        const { count: total, rows: coldWallets } = await ColdWallet.findAndCountAll({order: [['updatedAt', 'DESC'], ['platform', 'ASC']]});
        return res.ok({
          items: mapper(coldWallets),
          total: total
        });
      } catch (error) {
        logger.error(error);
        next(error);
      }
    }
};

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

        const valid = verifyAddress(e.platform, e.reward_address);
        if (!valid) {
          errorMessage = `invalid address of ${e.platform}!`;
          break;
        }
      }
    }
    return errorMessage;
}
