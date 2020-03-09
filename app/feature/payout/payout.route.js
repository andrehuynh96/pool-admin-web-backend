const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');
const controller = require('./payout.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/payouts',
  authenticate,
  authority(Permission.VIEW_LIST_PAYOUT_STAKING_PLATFORM),
  controller.get
);

/*********************************************************************/

/**
 * @swagger
 * /web/payouts:
 *   get:
 *     summary: get pay out
 *     tags:
 *       - Pay out
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
                  [ { id: 1,
                      platform: 'ETH',
                      token_name: 'INFT',
                      token_symbol: 'INFT',
                      token_address: '0x1716a6f9D3917966d934Ce7837113A30dFFda9F4',
                      actived_flg:: true,
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

router.put(
  '/payouts/:id',
  validator(update),
  authenticate,
  authority(Permission.UPDATE_PAYOUT_STAKING_PLATFORM),
  controller.update
);




/*********************************************************************/

/**
 * @swagger
 * /web/payouts/:id:
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
 *            type: object
 *            required:
 *            - token_name
 *            - token_symbol
 *            - activate_flg
 *            example:
 *               {      "token_name": "Infinito",
                        "token_symbol": "INFT",
                        "actived_flg": true
                  }
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
  '/payouts',
  validator(create),
  authenticate,
  authority(Permission.CREATE_PAYOUT_STAKING_PLATFORM),
  controller.create
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/payouts:
 *   post:
 *     summary: update pay out
 *     tags:
 *       - Pay out
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: object
 *            required:
 *            - platform
 *            - token_name
 *            - token_symbol
 *            - token_address
 *            - activate_flg
 *            example:
 *               {     "platform": "ETH",
                        "token_name": "Infinito",
                        "token_symbol": "INFT",
                        "token_address": "0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                        "actived_flg": true
                  }
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