const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');
const controller = require('./staking-plan.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/staking-platforms/:staking_platform_id/plans',
  authenticate,
  authority(Permission.VIEW_LIST_PLAN_STAKING_PLATFORM),
  controller.getPlans
);

/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/{staking_platform_id}/plans:
 *   get:
 *     summary: get staking plan
 *     tags:
 *       - Staking Plan
 *     description:
 *     parameters:
 *       - in: path
 *         name: staking_platform_id
 *         type: string
 *         required: true
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                data: {
                limit: 20,
                offset: 1,
                total: 10,
                items: [
                  {
                  id: "0e37df36-f698-11e6-8dd4-cb9ced3df976",
                  staking_platform_id: "96b7f440-1a3b-11ea-978f-2e728ce88125",
                  staking_plan_code: "plan-001",
                  duration: 10,
                  duration_type: "YEAR",
                  reward_per_year: "9.100",
                  actived_flg: true,
                  reward_in_diff_platform_flg: true,
                  reward_platform: "BTC",
                  reward_token_address: "0x5d4206fc925fddbae8c025b8c04a17b82fb83acc",
                  createdAt: "2020-01-06T11:35:56.051Z",
                  updatedAt: "2020-01-06T11:35:56.051Z"
                  },
                  {
                  id: "0e37df36-f698-11e6-8dd4-cb9ced3df978",
                  staking_platform_id: "96b7f440-1a3b-11ea-978f-2e728ce88125",
                  staking_plan_code: "plan-031",
                  duration: 20,
                  duration_type: "WEEK",
                  reward_per_year: "3.400",
                  actived_flg: true,
                  reward_in_diff_platform_flg: false,
                  reward_platform: "ETH",
                  reward_token_address: "0x5d4206fc925fddbae8c025b8c04a17b82fb83acc",
                  createdAt: "2020-01-06T11:35:56.051Z",
                  updatedAt: "2020-01-06T11:35:56.051Z"
                  },
                  {
                  id: "0e37df36-f698-11e6-8dd4-cb9ced3df979",
                  staking_platform_id: "96b7f440-1a3b-11ea-978f-2e728ce88125",
                  staking_plan_code: "plan-041",
                  duration: 1,
                  duration_type: "YEAR",
                  reward_per_year: "4.900",
                  actived_flg: true,
                  reward_in_diff_platform_flg: false,
                  reward_platform: "ETH",
                  reward_token_address: "0x5d4206fc925fddbae8c025b8c04a17b82fb83acc",
                  createdAt: "2020-01-06T11:35:56.051Z",
                  updatedAt: "2020-01-06T11:35:56.051Z"
                  }
                ]
                }
              }
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
  authenticate,
  authority(Permission.VIEW_PLAN_STAKING_PLATFORM),
  controller.getDetail
);

/**
 * @swagger
 * /web/staking-platforms/{staking_platform_id}/plans/{plan_id}:
 *   get:
 *     summary: get staking plan detail
 *     tags:
 *       - Staking Plan
 *     description:
 *     parameters:
 *       - in: path
 *         name: staking_platform_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: plan_id
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *            { data:
                { id: '0e37df36-f698-11e6-8dd4-cb9ced3df978',
                  staking_platform_id: '96b7f440-1a3b-11ea-978f-2e728ce88125',
                  staking_plan_code: 'plan-031',
                  duration: 20,
                  duration_type: 'WEEK',
                  reward_per_year: '3.400',
                  actived_flg: true,
                  reward_in_diff_platform_flg: false,
                  reward_platform: 'ETH',
                  reward_token_address: '0x5d4206fc925fddbae8c025b8c04a17b82fb83acc',
                  createdAt: '2020-01-06T11:35:56.051Z',
                  updatedAt: '2020-01-06T11:35:56.051Z' } }
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

router.put(
  '/staking-platforms/:staking_platform_id/plans/:plan_id',
  authenticate,
  authority(Permission.UPDATE_PLAN_STAKING_PLATFORM),
  validator(update),
  controller.update
)

/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/{staking_platform_id}/plans/{plan_id}:
 *   put:
 *     summary: update plan
 *     tags:
 *       - Staking Plan
 *     description:
 *     parameters:
 *       - in: path
 *         name: staking_platform_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: plan_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: object
 *            example:
 *               {
 *                  staking_plan_code: "plan-032",
                    duration: 21,
                    duration_type: "MONTH",
                    reward_per_year: 3.500
 *               }
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
  authenticate,
  authority(Permission.CREATE_PLAN_STAKING_PLATFORM),
  validator(create),
  controller.create
)

/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/{staking_platform_id}/plans/{plan_id}:
 *   post:
 *     summary: create plan
 *     tags:
 *       - Staking Plan
 *     description:
 *     parameters:
 *       - in: path
 *         name: staking_platform_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: plan_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: object
 *            example:
 *               {
 *                  staking_plan_code: "plan-032",
                    duration: 21,
                    duration_type: "MONTH",
                    reward_per_year: 3.500
 *               }
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

module.exports = router;

