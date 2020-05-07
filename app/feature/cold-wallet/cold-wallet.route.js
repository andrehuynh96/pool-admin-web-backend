const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { update } = require('./validator');
const controller = require('./cold-wallet.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/cold-wallets',
  authenticate,
  authority(Permission.VIEW_LIST_COLD_WALLET),
  controller.getAll
);

router.post(
  '/cold-wallets',
  authenticate,
  authority(Permission.UPDATE_COLD_WALLET),
  validator(update),
  controller.update
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/cold-wallets:
 *   post:
 *     summary: update cold wallets
 *     tags:
 *       - Cold Wallet
 *     description:
 *     parameters:
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
                          "percenctage": 68,
                          "reward_address": "",
                          "min_amount": 0,
                          "enable_flg": false
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
                          "id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
                          "platform": "ETH",
                          "percenctage": 68,
                          "reward_address": "",
                          "min_amount": 0,
                          "enable_flg": false,
                          "created_at": "",
                          "updated_at": "",
                          "created_by": 1,
                          "updated_by": 2
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
 *     summary: get cold wallets
 *     tags:
 *       - Cold Wallet
 *     description:
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data": {
                    "items": [
                      {
                          "id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
                          "platform": "ATOM",
                          "percenctage": 68,
                          "reward_address": "",
                          "min_amount": 0,
                          "enable_flg": false,
                          "created_at": "",
                          "updated_at": "",
                          "created_by": 1,
                          "updated_by": 2
                      }
                    ],
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
 *
 */

