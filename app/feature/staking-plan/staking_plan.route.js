const express = require('express');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./staking_plan.request-schema');
const controller = require('./payout.controller');
const authenticate = require('app/middleware/authenticate.middleware');

const router = express.Router();

router.get(
  '/staking-platforms/:staking_platform_id/plans',
  controller.getPlans
);

/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/:staking_platform_id/payouts:
 *   get:
 *     summary: get pay out
 *     tags:
 *       - Pay out
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             { data:
   [ { id: 1,
       staking_platform_id: '96b7f440-1a3b-11ea-978f-2e728ce88125',
       reward_platform: 'ETH',
       token_name: 'INFT',
       token_address: 'dac17f958d2ee523',
       reward_max_payout: 10,
       createdAt: '2020-01-13T03:15:23.525Z',
       updatedAt: '2020-01-13T03:15:23.525Z' } ] }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */


router.get(
  '/staking-platforms/:staking_platform_id/plans/:plan_id',
  controller.getDetail
);

router.put(
  '/staking-platforms/:staking_platform_id/plans/:plan_id',
  controller.update
)

/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/:staking_platform_id/payouts:
 *   put:
 *     summary: update pay out
 *     tags:
 *       - Pay out
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: array
 *            example:
 *               [{
                        "id":1,
                        "max_payout":100,
                  }]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
 *             }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */

router.post(
  '/staking-platforms/:staking_platform_id/plans',
  controller.create
)

module.exports = router;

