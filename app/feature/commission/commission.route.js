const express = require('express');;
const controller = require('app/feature/commission/commission.controller');
const authenticate = require('app/middleware/authenticate.middleware');

const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');
const requestSchema = require('./commission.request-schema');
const validator = require('app/middleware/validator.middleware');

const router = express.Router();

router.get(
  '/settings/commissions',
  authenticate,
  authority(Permission.VIEW_LIST_COMMISSION_SETTING),
  controller.get
);

/** *******************************************************************/


/**
 * @swagger
 * /web/settings/commissions:
 *   get:
 *     summary: get setting commission
 *     tags:
 *       - Setting
 *     description:
 *     parameters:
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
 *            {
                "data": {
                    "items": [
                        {
                            "id": 2,
                            "platform": "ATOM",
                            "cycle": 50,
                            "cycle_type": "BLOCK",
                            "min_amount": 1,
                            "amount_unit": "uatom",
                            "min_amount_withdrawal": 1,
                            "created_at": "2019-08-02T03:00:00.000Z",
                            "updated_at": "2020-08-18T04:31:40.966Z",
                            "created_by": 5,
                            "updated_by": 115
                        },
                        {
                            "id": 5,
                            "platform": "ETH",
                            "cycle": 1,
                            "cycle_type": "BLOCK",
                            "min_amount": 9007199254740990,
                            "amount_unit": "bnr",
                            "min_amount_withdrawal": 9007199254740990,
                            "created_at": "2019-08-02T03:00:00.000Z",
                            "updated_at": "2020-08-18T04:31:41.032Z",
                            "created_by": 5,
                            "updated_by": 115
                        },
                        {
                            "id": 4,
                            "platform": "ETH",
                            "cycle": 1,
                            "cycle_type": "BLOCK",
                            "min_amount": 10,
                            "amount_unit": "moo",
                            "min_amount_withdrawal": 10,
                            "created_at": "2019-08-02T03:00:00.000Z",
                            "updated_at": "2020-08-18T04:31:41.104Z",
                            "created_by": 5,
                            "updated_by": 115
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
 */

router.get(
  '/settings/commissions/histories',
  authenticate,
  authority(Permission.VIEW_COMMISSION_HISTORY_SETTING),
  controller.getHistory
);

module.exports = router;




/** *******************************************************************/

/**
 * @swagger
 * /web/settings/commissions/histories:
 *   get:
 *     summary: get commission setting history
 *     tags:
 *       - Setting
 *     description:
 *     parameters:
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
 *             { data: 
 *                {
 *                  items: [],
 *                  "offset": 0,
                    "limit": 10,
                    "total": 1
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

router.post(
  '/settings/commissions',
  authenticate,
  authority(Permission.CREATE_COMMISSION_SETTING),
  validator(requestSchema),
  controller.update
);

/**
 * @swagger
 * /web/settings/commissions:
 *   post:
 *     summary: update commission setting
 *     tags:
 *       - Setting
 *     description:
 *     parameters: 
 *       - in: body
 *         name: data
 *         description: Data for commission.
 *         schema:
 *            type: array
 *            example:
 *               { items: [{
                        "id": 1, 
                        "cycle":1000,
                        "min_amount": 1000000,
                        "min_amount_withdrawal": 1000000
                    }]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":[{ id: 'a92b913c-256a-11ea-978f-2e728ce88125',
                        platform: 'IRIS',
                        cycle: 1000,
                        cycle_type: 'BLOCK',
                        min_amount: 1000000,
                        amount_unit: 'IRIS',
                        min_amount_withdrawal: 1000000,
                        created_by: 5,
                        created_at: '2019-08-02T03:00:00.000Z'}]
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