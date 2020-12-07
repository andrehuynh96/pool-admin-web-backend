const logger = require('app/lib/logger');
const ValidatorWithdrawHis = require('app/model/staking').validator_withdrawal_his;
const DistributeCommission = require('app/model/staking').distribute_commissions;
const Calculation = require('app/model/tezos').calculations;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require('app/config');
const tezosValidatorAddress = config.tezosValidatorAddress;

module.exports = {
  get: async (req, res, next) => {
    try {
      const { query: { start_date, end_date } } = req;
      const where = {};
      if (start_date && end_date) {
        where.created_at = {
          [Op.gte]: start_date,
          [Op.lte]: end_date
        };
      }

      const totalReward = await ValidatorWithdrawHis.findAll({
        attributes: [
          'platform',
          [Sequelize.fn('sum', Sequelize.col('amount')), 'total_reward '],
          [Sequelize.fn('SUM', Sequelize.literal('(amount - commission_amount)')), 'validator_amount']
        ],
        where: where,
        group: ['platform'],
        raw:true
      });

      const tezosTotalReward = await Calculation.sum('amount',{
        where: {
          ...where,
          type: 'B'
        },
      });

      const tezosValidatorAmount = await Calculation.sum('amount',{
        where: {
          ...where,
          type: 'D',
          address: tezosValidatorAddress
        },
      });

      const tezos = {
        platform: 'XTZ',
        total_reward: tezosTotalReward,
        validator_amount: tezosValidatorAmount
      };
      totalReward.push(tezos);

      const totalDistributeCommission = await DistributeCommission.findAll({
        attributes: [
          'platform',
          [Sequelize.fn('sum', Sequelize.col('commission_amount')), 'total_commission']
        ],
        where: {
          ...where,
          commission_amount: { [Op.not]: 'NaN' }
        },
        group: ['platform'],
        raw: true
      });

      const cache = totalDistributeCommission.reduce((result,value) => {
        result[value.platform] = value.total_commission;
        return result;
      },{});
      totalReward.forEach(item => {
        cache[item.platform];
        if (cache[item.platform]) {
          item.total_commission = cache[item.platform];
        }
        else {
          item.total_commission = 0;
        }
      });

      return res.ok(totalReward);
    }
    catch (error) {
      logger.error('Get total reward fail', error);
      next(error);
    }
  }
};
