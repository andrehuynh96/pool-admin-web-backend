const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create } = require('./validator');
const controller = require('./partner-commission.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/partners/:partner_id/commissions',
  authenticate,
  authority(Permission.VIEW_LIST_COMMISSION_PARTNER),
  controller.all
);

router.post(
  '/partners/:partner_id/commissions',
  authenticate,
  authority(Permission.CREATE_COMMISSION_PARTNER),
  validator(create),
  controller.create
);
router.get(
  '/partners/:partner_id/commissions/histories',
  authenticate,
  authority(Permission.VIEW_HISTORY_COMMISSION_PARTNER),
  controller.getHis
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/commissions:
 *   post:
 *     summary: update partner commissions
 *     tags:
 *       - Commission
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for commision.
 *         schema:
 *            type: array
 *            example:
 *               {
                    "items": [
                      {
                          "id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
                          "platform": "ETH",
                          "commission": 68,
                          "reward_address": "",
                          "staking_platform_id": ""
                      }
                    ]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": [
                      {
                        "id": "f62634d4-30f9-11ea-aec2-2e728ce88125",
                        "platform": "ATOM",
                        "symbol": "ATOM",
                        "commission": 69,
                        "reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
                        "staking_platform_id": "cba566c6-35ae-11ea-978f-2e728ce88125",
                        "updated_by": 64,
                        "updated_at": "2020-04-22T04:07:27.929Z",
                        "partner_updated_by": "ed483de6-2d14-11ea-978f-2e728ce88125"
                      },
                      {
                        "id": "f62634d4-30f9-11ea-aec2-2e728ce88125",
                        "platform": "ATOM",
                        "symbol": "ATOM",
                        "commission": 69,
                        "reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
                        "staking_platform_id": "cba566c6-35ae-11ea-978f-2e728ce88125",
                        "updated_by": 64,
                        "updated_at": "2020-04-22T04:07:27.929Z",
                        "partner_updated_by": "ed483de6-2d14-11ea-978f-2e728ce88125"
                      }
                    ]
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
 *   get:
 *     summary: get partner commissions
 *     tags:
 *       - Commission
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
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
                  "data": {
                    "items": [
                      {
                       	"id": "ac098ffd-1ff3-47c5-9244-38eda2dcfc59",
                        "platform": "ETH",
                        "commission": 69,
                        "reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
                        "staking_platform_id": "96a29602-257d-4041-85c4-ea0fb17e0e67",
                        "updated_by": 64,
                        "updated_at": "2020-04-22T04:52:01.134Z",
                        "partner_updated_by": "ed483de6-2d14-11ea-978f-2e728ce88125"
                      }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 3
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
 *
 */

/**
* @swagger
* /web/partners/{partner_id}/commissions/histories:
*   get:
*     summary: get partner commission histories
*     tags:
*       - Commission
*     description:
*     parameters:
*       - in: path
*         name: partner_id
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
                "data": {
                  "items": [
                    {
                      "id": "c8f44aac-8801-49e1-8f18-f87328801bb1",
                      "platform": "BTC",
                      "commission": 12,
                      "reward_address": "",
                      "updated_by": 10,
                      "updated_by_user_name": "anh Hung` dep chai"
                    },
                    {
                      "id": "eb56566b-dc6e-477b-a271-f712e887ea2c",
                      "platform": "ETH",
                      "commission": 11,
                      "reward_address": "",
                      "updated_by": 64
                    }
                  ],
                  "offset": 0,
                  "limit": 10,
                  "total": 2
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
*
*/
