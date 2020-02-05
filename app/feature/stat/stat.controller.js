const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const TrackingVote = require('app/model/staking').tracking_votes;
const CosmosAccount = require('app/model/staking').cosmos_accounts;
const IrisAccount = require('app/model/staking').iris_accounts;
const TrackingVoteType = require('app/model/staking/value-object/tracking-vote-type');
const DistributeCommissionHistory = require('app/model/staking').distribute_commission_his;
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
    const { query: { from, to},  params: { partner_id }} = req;
    let fdate = new Date(from);
    let tdate = new Date(new Date(to).setDate(new Date(to).getDate() + 1));
    logger.info('stat::from::', fdate);
    logger.info('stat::to::', tdate);
    const [distributions] = await Promise.all([
      getDistributeCommissions(fdate, tdate, partner_id)
    ])
    return res.ok({
      items: distributions
    });
  } catch(error) {
    logger.error(error);
    next(error); 
  }
}

stat.drawChart = async (req, res, next) => {
  try {
    logger.info('stat::draw::chart');
    let items = [];
    const { query: { from, to},  params: { partner_id }} = req;
    let fdate = new Date(from);
    let tdate = new Date(new Date(to).setDate(new Date(to).getDate() + 1));
    logger.info('stat::from::', fdate);
    logger.info('stat::to::', tdate);
    const [cosmosIds, irisIds] = await Promise.all([
      getCosmosChartId(fdate, tdate, partner_id),
      getIrisChartId(fdate, tdate, partner_id)
    ])
    const [tezosDays, tezosWeeks, tezosMonths, cosmosDays, cosmosWeeks, cosmosMonths, irisDays, irisWeeks, irisMonths] = await Promise.all([
      getTezosChartDay(fdate, tdate, partner_id),
      getTezosChartWeek(fdate, tdate, partner_id),
      getTezosChartMonth(fdate, tdate, partner_id),
      getCosmosChartDay(fdate, tdate, partner_id, cosmosIds),
      getCosmosChartWeek(fdate, tdate, partner_id, cosmosIds),
      getCosmosChartMonth(fdate, tdate, partner_id, cosmosIds),
      getIrisChartDay(fdate, tdate, partner_id, irisIds),
      getIrisChartWeek(fdate, tdate, partner_id, irisIds),
      getIrisChartMonth(fdate, tdate, partner_id, irisIds)
    ])
    items.push({platform: 'XTZ', data: { day: tezosDays, week: tezosWeeks, month: tezosMonths}});
    items.push({platform: 'ATOM', data: { day: cosmosDays, week: cosmosWeeks, month: cosmosMonths}});
    items.push({platform: 'IRIS', data: { day: irisDays, week: irisWeeks, month: irisMonths}});
    return res.ok({
      items: items
    });
  } catch (error) {
    logger.error(error);
    next(error); 
  }
}

stat.drawCommission = async (req, res, next) => {
  try {
    logger.info('stat::draw::chart::commission');
    let items = [];
    const { query: { from, to},  params: { partner_id }} = req;
    let fdate = new Date(from);
    let tdate = new Date(new Date(to).setDate(new Date(to).getDate() + 1));
    logger.info('stat::from::', fdate);
    logger.info('stat::to::', tdate);
    const [dDays, dWeeks, dMonths] = await Promise.all([
      getDistributeCommissionsDay(fdate, tdate, partner_id),
      getDistributeCommissionsWeek(fdate, tdate, partner_id),
      getDistributeCommissionsMonth(fdate, tdate, partner_id)
    ]);
    let tezos = {platform: 'XTZ', data: { day: [], week: [], month: []}};
    let cosmos = {platform: 'ATOM', data: { day: [], week: [], month: []}};
    let iris = {platform: 'IRIS', data: { day: [], week: [], month: []}};
    for (let d of dDays) {
      if (d.platform == 'XTZ') {
        tezos.data.day.push({date: d.getDataValue('date'), amount: d.getDataValue('amount')});
      } else if (d.platform == 'ATOM') {
        cosmos.data.day.push({date: d.getDataValue('date'), amount: d.getDataValue('amount')});
      } else if (d.platform == 'IRIS') {
        iris.data.day.push({date: d.getDataValue('date'), amount: d.getDataValue('amount')});
      }
    }
    for (let d of dWeeks) {
      if (d.platform == 'XTZ') {
        tezos.data.week.push({week: d.getDataValue('week'), amount: d.getDataValue('amount')});
      } else if (d.platform == 'ATOM') {
        cosmos.data.week.push({week: d.getDataValue('week'), amount: d.getDataValue('amount')});
      } else if (d.platform == 'IRIS') {
        iris.data.week.push({week: d.getDataValue('week'), amount: d.getDataValue('amount')});
      }
    }
    for (let d of dMonths) {
      if (d.platform == 'XTZ') {
        tezos.data.month.push({month: d.getDataValue('month'), amount: d.getDataValue('amount')});
      } else if (d.platform == 'ATOM') {
        cosmos.data.month.push({month: d.getDataValue('month'), amount: d.getDataValue('amount')});
      } else if (d.platform == 'IRIS') {
        iris.data.month.push({month: d.getDataValue('month'), amount: d.getDataValue('amount')});
      }
    }
    items.push(tezos);
    items.push(cosmos);
    items.push(iris);
    return res.ok({
      items: items
    });
  } catch (error) {
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
          temp.push(cosmos.address);
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
          temp.push(iris.address);
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

const getDistributeCommissions = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const distributions = await DistributeCommissionHistory.findAll({
        attributes: ['platform', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'amount']],
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

const getTezosChartDay = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const votes = await TrackingVote.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'date'], [Sequelize.fn('count', Sequelize.col('voter_address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { partner_id: partner_id, platform: 'XTZ', type: TrackingVoteType.DELEGATE, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'date'],
        order: Sequelize.literal('date ASC')
      });
      resolve(votes)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getTezosChartWeek = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const votes = await TrackingVote.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'week', Sequelize.col('created_at')), 'week'], [Sequelize.fn('count', Sequelize.col('voter_address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { partner_id: partner_id, platform: 'XTZ', type: TrackingVoteType.DELEGATE, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'week'],
        order: Sequelize.literal('week ASC')
      });
      resolve(votes)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getTezosChartMonth = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const votes = await TrackingVote.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('created_at')), 'month'], [Sequelize.fn('count', Sequelize.col('voter_address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { partner_id: partner_id, platform: 'XTZ', type: TrackingVoteType.DELEGATE, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'month'],
        order: Sequelize.literal('month ASC')
      });
      resolve(votes)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getCosmosChartId = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cosmoses = await CosmosAccount.findAll({
        attributes: ['id', 'address', 'balance'],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        order: [['createdAt' ,'DESC' ]]
      })
      let temp = [];
      let ids = [];
      for (cosmos of cosmoses) {
        if (temp.indexOf(cosmos.address) == -1) {
          temp.push(cosmos.address);
          if (cosmos.balance > 0) {
            ids.push(cosmos.id);
          }
        }
      }
      resolve(ids);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getIrisChartId = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const irises = await IrisAccount.findAll({
        attributes: ['id', 'address', 'balance'],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        order: [['createdAt' ,'DESC' ]]
      })
      let temp = [];
      let ids = [];
      for (iris of irises) {
        if (temp.indexOf(iris.address) == -1) {
          temp.push(iris.address);
          if (iris.balance > 0) {
            ids.push(iris.id);
          }
        }
      }
      resolve(ids);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getCosmosChartDay = async(from, to, partner_id, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cosmoses = await CosmosAccount.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'date'], [Sequelize.fn('count', Sequelize.col('address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { id: ids, partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'date'],
        order: Sequelize.literal('date ASC')
      })
      resolve(cosmoses);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getCosmosChartWeek = async(from, to, partner_id, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cosmoses = await CosmosAccount.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'week', Sequelize.col('created_at')), 'week'], [Sequelize.fn('count', Sequelize.col('address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { id: ids, partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'week'],
        order: Sequelize.literal('week ASC')
      })
      resolve(cosmoses);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getCosmosChartMonth = async(from, to, partner_id, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cosmoses = await CosmosAccount.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('created_at')), 'month'], [Sequelize.fn('count', Sequelize.col('address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { id: ids, partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'month'],
        order: Sequelize.literal('month ASC')
      })
      resolve(cosmoses);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getIrisChartDay = async(from, to, partner_id, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const irises = await IrisAccount.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'date'], [Sequelize.fn('count', Sequelize.col('address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { id: ids, partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'date'],
        order: Sequelize.literal('date ASC')
      })
      resolve(irises);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getIrisChartWeek = async(from, to, partner_id, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const irises = await IrisAccount.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'week', Sequelize.col('created_at')), 'week'], [Sequelize.fn('count', Sequelize.col('address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { id: ids, partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'week'],
        order: Sequelize.literal('week ASC')
      })
      resolve(irises);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getIrisChartMonth = async(from, to, partner_id, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const irises = await IrisAccount.findAll({
        attributes: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('created_at')), 'month'], [Sequelize.fn('count', Sequelize.col('address')), 'user'], [Sequelize.fn('sum', Sequelize.col('balance')), 'balance']],
        where: { id: ids, partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'month'],
        order: Sequelize.literal('month ASC')
      })
      resolve(irises);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getDistributeCommissionsDay = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const distributions = await DistributeCommissionHistory.findAll({
        attributes: ['platform', [Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'date'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'amount']],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'platform', 'date'],
        order: Sequelize.literal('date ASC')
      });
      resolve(distributions)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getDistributeCommissionsWeek = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const distributions = await DistributeCommissionHistory.findAll({
        attributes: ['platform', [Sequelize.fn('date_trunc', 'week', Sequelize.col('created_at')), 'week'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'amount']],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'platform', 'week'],
        order: Sequelize.literal('week ASC')
      });
      resolve(distributions)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}

const getDistributeCommissionsMonth = async(from, to, partner_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const distributions = await DistributeCommissionHistory.findAll({
        attributes: ['platform', [Sequelize.fn('date_trunc', 'month', Sequelize.col('created_at')), 'month'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'amount']],
        where: { partner_id: partner_id, createdAt: {[Op.gte]: from, [Op.lt]: to}},
        group: ['partner_id', 'platform', 'month'],
        order: Sequelize.literal('month ASC')
      });
      resolve(distributions)
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}


module.exports = stat;