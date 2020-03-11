const logger = require('app/lib/logger');
const config = require('app/config');
const Erc20EventPool = require('app/model/staking').erc20_event_pools;
const TransactionStatus = require('app/model/staking/value-object/transaction-status');
const EventType = require('app/model/staking/value-object/fire-event-type');
const database = require('app/lib/database').db().staking;
const Sequelize = require('sequelize');
const db = require('app/model/staking');
const Op = Sequelize.Op;
const InfinitoApi = require('node-infinito-api');
const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secret,
  baseUrl: config.sdk.baseUrl
};
const api = new InfinitoApi(opts);
const service = api.getChainService().ETH;
module.exports = {
  execute: async () => {
    try {
      let transactions = await Erc20EventPool.findAll({
        where: {
          status: TransactionStatus.PENDING,
          tx_id: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        }
      });
      for (let e of transactions) {
        const transaction = await database.transaction();
        try {
          let tx = await service.getTransaction(e.tx_id);
          logger.info('tx.data: ', tx.data);
          if (tx.data && tx.data.status != undefined) {
            let sql = '';
            if (tx.data.status) {
              await Erc20EventPool.update({
                status: TransactionStatus.CONFIRMED
              }, {
                where: {
                  id: e.id
                }
              }, { transaction });
              sql = e.successful_event;
            } else {
              await Erc20EventPool.update({
                status: TransactionStatus.FAILED,
                transaction_log: tx.data.transaction_log
              }, {
                where: {
                  id: e.id
                }
              },  { transaction });
              sql = e.fail_event;
            }
            if (e.event_type == EventType.DB_SCRIPT) {
              logger.info('sql query: ', sql);
              await database.sequelize.query(sql, {transaction});
            }
          }
          await transaction.commit();
        } catch (err) {
          await transaction.rollback();
          throw err;
        }
      } 
    }
    catch (err) {
      logger.error("check-erc20-even job error:", err);
    }
  }
}
