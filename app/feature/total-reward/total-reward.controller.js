const logger = require('app/lib/logger');
const ValidatorWithdrawHis = require('app/model/staking').validator_withdrawal_his;
const StakingPlatform = require('app/model/staking').staking_platforms;
const StakingType = require('app/model/staking/value-object/staking-type');
const Calculation = require('app/model/tezos').calculations;
const db = require("app/model/staking");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const BigNumber = require('bignumber.js');
const currencyDecimals = {
  ATOM: 6,
  IRIS: 18,
  ADA: 6,
  ONG: 9,
  XTZ: 6,
  ONE: 18
};
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
          [Sequelize.fn('sum', Sequelize.col('amount')), 'total_reward'],
          [Sequelize.fn('SUM', Sequelize.literal('(amount - commission_amount)')), 'validator_amount']
        ],
        where: where,
        group: ['platform'],
        raw: true
      });

      const tezosTotalReward = await Calculation.sum('amount', {
        where: {
          ...where,
          type: 'B'
        },
      });
      const tezosValidator = await StakingPlatform.findOne({
        where: {
          symbol: 'XTZ',
          staking_type: StakingType.NATIVE
        }
      });
      const tezosValidatorAddress = tezosValidator.validator_address;
      const tezosValidatorAmount = await Calculation.sum('amount', {
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

      const getChildpoolCommissionSQL = `select q.*, p."name"
          from
            ( select sum(t.amount) as amount, t.partner_id, t.platform
              from ((
                select commission_amount as amount, partner_id::uuid , platform, 'DISTRIBUTE' as source
                from
                  distribute_commission_his
                where
                  created_at >= :startDate
                  and created_at <= :endDate)
          union all (
            select amount, partner_id::uuid , platform, 'BALANCE' as source
            from partner_commission_balance_his
            where
              created_at >= :startDate
              and created_at <= :endDate)) as t
            group by
              partner_id,
              platform) as q
          inner join partners as p on p.id = q.partner_id`;
      let startDate,endDate;
      if (start_date && end_date) {
        startDate = start_date;
        endDate = end_date;
      }
      else {
        startDate = new Date(1970, 1, 1);
        endDate = new Date();
      }
      const childpoolCommissions = await db.sequelize.query(getChildpoolCommissionSQL,
        {
          replacements: {
            startDate: startDate,
            endDate: endDate
          },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      const childpoolCommissionByPlatform = totalReward.reduce((result, value) => {
        if (value.platform == 'ONT') {
          value.platform = 'ONG';
        }

        result[value.platform] = 0;
        return result;
      },{});

      childpoolCommissions.forEach(item => {
        if (item.platform == 'ONT') {
          item.platform = 'ONG';
        }

        if (childpoolCommissionByPlatform[item.platform] != null) {
          childpoolCommissionByPlatform[item.platform] += item.amount;
        }
      });

      totalReward.forEach(item => {
        item.master_pool = item.total_reward - (item.validator_amount + childpoolCommissionByPlatform[item.platform]);

        item.total_reward = rewardByCurrency(item.total_reward,item.platform);
        item.validator_amount = rewardByCurrency(item.validator_amount,item.platform);
        item.master_pool = rewardByCurrency(item.master_pool,item.platform);
      });

      childpoolCommissions.forEach(item => {
        item.amount = rewardByCurrency(item.amount,item.platform);
      });
      return res.ok({
        total_reward: totalReward,
        childpool_commission: childpoolCommissions
      });
    }
    catch (error) {
      logger.error('Get total reward fail', error);
      next(error);
    }
  }
};

function rewardByCurrency(reward,platform) {
  if (!reward) {
    return reward;
  }
  if (!currencyDecimals[platform]) {
    return reward;
  }
  const value = new BigNumber(reward).div(Math.pow(10,currencyDecimals[platform])).toFixed(3);
  const result = new BigNumber(value).toFormat();
  return result;
}
