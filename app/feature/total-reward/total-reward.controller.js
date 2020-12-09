const logger = require('app/lib/logger');
const ValidatorWithdrawHis = require('app/model/staking').validator_withdrawal_his;
const StakingPlatform = require('app/model/staking').staking_platforms;
const StakingType = require('app/model/staking/value-object/staking-type');
const Calculation = require('app/model/tezos').calculations;
const db = require("app/model/staking");
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
          name: 'Tezos',
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
