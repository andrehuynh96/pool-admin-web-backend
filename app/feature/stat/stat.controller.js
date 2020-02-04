const logger = require('app/lib/logger');
const config = require('app/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const TrackingVote = require('app/model/staking').tracking_votes;
const CosmosAccount = require('app/model/staking').cosmos_accounts;
const IrisAccount = require('app/model/staking').iris_accounts;
const TrackingVoteType = require('app/model/staking/value-object/tracking-vote-type');
const DistributeCommissionHistory = require('app/model/staking').distribute_commission_his;
const PartnerCommissionBalanceHistory = require('app/model/staking').partner_commission_balance_his;
var stat = {};

stat.countUser = async (req, res, next) => {
  try {
    logger.info('stat::count::user');
    let items = [];
    const { query: { from, to},  params: { partner_id }} = req;
    let fdate = new Date(from);
    let tdate = new Date(new Date(to).setDate(new Date(to).getDate() + 1));
    logger.info('stat::from::', fdate);
    logger.info('stat::to::', tdate);
    const [tezos, cosmos, iris] = await Promise.all([
      getTezos(fdate, tdate, partner_id),
      getCosmos(fdate, tdate, partner_id),
      getIris(fdate, tdate, partner_id)
    ])
    if (tezos) {
      items.push(tezos);
    }
    if (cosmos) {
      items.push(cosmos);
    }
    if (iris) {
      items.push(iris);
    }
    return res.ok({
      items: items
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

stat.sumCommission = async (req, res, next) => {
  try {
    logger.info('stat::sum::commission');
    let items = [];
    const { query: { from, to},  params: { partner_id }} = req;
    let fdate = new Date(from);
    let tdate = new Date(new Date(to).setDate(new Date(to).getDate() + 1));
    logger.info('stat::from::', fdate);
    logger.info('stat::to::', tdate);
    const [distributions, balances] = await Promise.all([
      getDistributeCommissions(fdate, tdate, partner_id),
      getPartnerCommissionBalances(fdate, tdate, partner_id)
    ])
    for (let distribution of distributions) {
      let amount = 0;
      for (let balance of balances) {
        if (distribution.getDataValue('platform') == balance.getDataValue('platform')) {
          amount = distribution.getDataValue('amount') + balance.getDataValue('amount');
        }
      }
      items.push({platform: distribution.platform, amount: amount})
    }
    return res.ok({
      items: items
    });
  } catch(error) {
    logger.error(error);
    next(error); 
  }
}

const getTezos = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const votes = await TrackingVote.findAll({
        attributes: ['platform', [Sequelize.fn('count', Sequelize.col('voter_address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { partner_id: partner_id, platform: 'XTZ', type: TrackingVoteType.DELEGATE, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'platform']
      });
      resolve(votes[0])
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getCosmos = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = 0;
      let balance = 0;
      const cosmoses = await CosmosAccount.findAll({
        attributes: ['address', 'balance'],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        order: [['createdAt' ,'DESC' ]]
      })
      let temp = [];
      for (cosmos of cosmoses) {
        if (temp.indexOf(cosmos.address) == -1) {
          temp.push(cosmos.address)
          if (cosmos.balance > 0) {
            user ++;
            balance = balance + cosmos.balance; 
          }
        }
      }
      if (user > 0) {
        resolve({platform: 'ATOM', user: user, balance: balance});
      } else {
        resolve();
      }
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getIris = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = 0;
      let balance = 0;
      const irises = await IrisAccount.findAll({
        attributes: ['address', 'balance'],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        order: [['createdAt' ,'DESC' ]]
      })
      let temp = [];
      for (iris of irises) {
        if (temp.indexOf(iris.address) == -1) {
          temp.push(iris.address)
          if (iris.balance > 0) {
            user ++;
            balance = balance + iris.balance; 
          }
        }
      }
      if (user > 0) {
        resolve({platform: 'IRIS', user: user, balance: balance});
      } else {
        resolve();
      }
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getDistributeCommissions= async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const distributions = await DistributeCommissionHistory.findAll({
        attributes: ['platform', [Sequelize.fn('sum', Sequelize.col('commission_amount')), 'amount']],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'platform']
      });
      resolve(distributions)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getPartnerCommissionBalances = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balances = await PartnerCommissionBalanceHistory.findAll({
        attributes: ['platform', [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'platform']
      });
      resolve(balances)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

module.exports = stat;