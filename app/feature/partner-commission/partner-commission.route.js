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
                        "id": "8f3d8b76-7915-493c-88f2-94ee074a56f1",
                        "platform": "ETC",
                        "commission": 68
                      },
                      {
                        "platform": "IRIS",
                        "commission": 70
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
                        "id": "8f3d8b76-7915-493c-88f2-94ee074a56f1",
                        "platform": "ETC",
                        "commission": 10,
                        "reward_address": "this_is_a_more_different_etc_address",
                        "updated_by": 10,
                        "updated_by_user_name": "testttttttttt"
                      },
                      {
                        "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                        "platform": "BTC",
                        "commission": 15,
                        "reward_address": "this_is_a_different_bitcoin_address",
                        "updated_by": 10,
                        "updated_by_user_name": "testttttttttt"
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
                        "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                        "platform": "BTC",
                        "commission": 15,
                        "reward_address": "this_is_a_different_bitcoin_address",
                        "updated_by": 10,
                        "updated_by_user_name": "testttttttttt"
                      },
                      {
                        "id": "2366f28e-8802-47b6-b96e-1cbf467f6978",
                        "platform": "IRIS",
                        "commission": 70,
                        "reward_address": "",
                        "updated_by": 64
                      },
                      {
                        "id": "92883d8c-4184-4cee-8eb7-c0bacee1ffcc",
                        "platform": "IRIS",
                        "commission": 24,
                        "reward_address": "",
                        "updated_by": 10,
                        "updated_by_user_name": "testttttttttt"
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
                      "updated_by_user_name": "testttttttttt"
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
