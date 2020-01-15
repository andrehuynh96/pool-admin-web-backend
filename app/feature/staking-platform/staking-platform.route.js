const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { create, update } = require('./validator');
const controller = require('./staking-platform.controller');

const router = express.Router();

router.get(
  '/staking-platforms/time-unit',
  authenticate,
  controller.timeUnit
);

router.get(
  '/staking-platforms',
  authenticate,
  controller.getAll
);

router.get(
  '/staking-platforms/:id',
  authenticate,
  controller.get
);

router.put(
  '/staking-platforms/:id',
  parseformdata,
  authenticate,
  validator(update),
  controller.update
);

router.post(
  '/staking-platforms',
  parseformdata,
  authenticate,
  validator(create),
  controller.create
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/time-unit:
 *   get:
 *     summary:  time unit
 *     tags:
 *       - Staking Platform
 *     description:
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":["HOUR","DAY","MONTH"]
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


/*********************************************************************/


/**
 * @swagger
 * /web/staking-platforms:
 *   get:
 *     summary: search platform
 *     tags:
 *       - Staking Platform
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
 *       - name: staking_type
 *         in: query
 *         type: string
 *       - name: actived_flg
 *         in: query
 *         type: boolean
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "items": [
                        {
                          "id":"96b7f440-1a3b-11ea-978f-2e728ce88125",
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":99,
                          "estimate_earn_per_year":"10",
                          "lockup_unvote":21,
                          "lockup_unvote_unit":"DAY",
                          "payout_reward":0,
                          "payout_reward_unit":"DAY",
                          "actived_flg":true,
                          "confirmation_block":5,
                          "staking_type":"CONTRACT",
                          "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                          "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                          "validator_address":null,
                          "deleted_flg":false,
                          "created_by":0,
                          "updated_by":0,
                          "createdAt":"2020-01-13T06:47:41.248Z",
                          "updatedAt":"2020-01-13T06:47:41.248Z"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 4
 *                 }
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



/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/{id}:
 *   get:
 *     summary: get staking platform by id
 *     tags:
 *       - Staking Platform
 *     description:
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "id":"96b7f440-1a3b-11ea-978f-2e728ce88125",
                      "name":"Ethereum",
                      "symbol":"ETH",
                      "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                      "description":"AWS token",
                      "order_index":99,
                      "estimate_earn_per_year":"10",
                      "lockup_unvote":21,
                      "lockup_unvote_unit":"DAY",
                      "payout_reward":0,
                      "payout_reward_unit":"DAY",
                      "actived_flg":true,
                      "confirmation_block":5,
                      "staking_type":"CONTRACT",
                      "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                      "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                      "validator_address":null,
                      "deleted_flg":false,
                      "created_by":0,
                      "updated_by":0,
                      "createdAt":"2020-01-13T06:47:41.248Z",
                      "updatedAt":"2020-01-13T06:47:41.248Z"
                    }

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


/*********************************************************************/




/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms/{id}:
 *   put:
 *     summary: update staking platform
 *     tags:
 *       - Staking Platform
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            - symbol
 *            - staking_type
 *            properties:
 *              name:
 *                type: string
 *              symbol:
 *                type: string
 *              icon:
 *                type: image
 *              description:
 *                type: string
 *              order_index:
 *                type: number
 *              estimate_earn_per_year:
 *                type: number
 *              lockup_unvote:
 *                type: number
 *              lockup_unvote_unit:
 *                type: string
 *              payout_reward:
 *                type: number
 *              payout_reward_unit:
 *                type: string
 *              actived_flg:
 *                type: boolean
 *              confirmation_block:
 *                type: number
 *              staking_type:
 *                type: string
 *              validator_address:
 *                type: string
 *              sc_lookup_addr:
 *                type: string
 *              sc_token_address:
 *                type: string
 *            example:
 *                  {
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":99,
                          "estimate_earn_per_year":"10",
                          "lockup_unvote":21,
                          "lockup_unvote_unit":"DAY",
                          "payout_reward":0,
                          "payout_reward_unit":"DAY",
                          "actived_flg":true,
                          "confirmation_block":5,
                          "staking_type":"CONTRACT",
                          "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                          "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                          "validator_address":null

 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "id":"96b7f440-1a3b-11ea-978f-2e728ce88125",
                      "name":"Ethereum",
                      "symbol":"ETH",
                      "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                      "description":"AWS token",
                      "order_index":99,
                      "estimate_earn_per_year":"10",
                      "lockup_unvote":21,
                      "lockup_unvote_unit":"DAY",
                      "payout_reward":0,
                      "payout_reward_unit":"DAY",
                      "actived_flg":true,
                      "confirmation_block":5,
                      "staking_type":"CONTRACT",
                      "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                      "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                      "validator_address":null,
                      "deleted_flg":false,
                      "created_by":0,
                      "updated_by":0,
                      "createdAt":"2020-01-13T06:47:41.248Z",
                      "updatedAt":"2020-01-13T06:47:41.248Z"
                    }

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


/*********************************************************************/




/*********************************************************************/

/**
 * @swagger
 * /web/staking-platforms:
 *   post:
 *     summary: create staking platform
 *     tags:
 *       - Staking Platform
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            - symbol
 *            - staking_type
 *            properties:
 *              name:
 *                type: string
 *              symbol:
 *                type: string
 *              icon:
 *                type: image
 *              description:
 *                type: string
 *              order_index:
 *                type: number
 *              estimate_earn_per_year:
 *                type: number
 *              lockup_unvote:
 *                type: number
 *              lockup_unvote_unit:
 *                type: string
 *              payout_reward:
 *                type: number
 *              payout_reward_unit:
 *                type: string
 *              actived_flg:
 *                type: boolean
 *              confirmation_block:
 *                type: number
 *              staking_type:
 *                type: string
 *              validator_address:
 *                type: string
 *              sc_lookup_addr:
 *                type: string
 *              sc_token_address:
 *                type: string
 *            example:
 *                  {
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":99,
                          "estimate_earn_per_year":"10",
                          "lockup_unvote":21,
                          "lockup_unvote_unit":"DAY",
                          "payout_reward":0,
                          "payout_reward_unit":"DAY",
                          "actived_flg":true,
                          "confirmation_block":5,
                          "staking_type":"CONTRACT",
                          "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                          "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                          "validator_address":null

 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "id":"96b7f440-1a3b-11ea-978f-2e728ce88125",
                      "name":"Ethereum",
                      "symbol":"ETH",
                      "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                      "description":"AWS token",
                      "order_index":99,
                      "estimate_earn_per_year":"10",
                      "lockup_unvote":21,
                      "lockup_unvote_unit":"DAY",
                      "payout_reward":0,
                      "payout_reward_unit":"DAY",
                      "actived_flg":true,
                      "confirmation_block":5,
                      "staking_type":"CONTRACT",
                      "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                      "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                      "validator_address":null,
                      "deleted_flg":false,
                      "created_by":0,
                      "updated_by":0,
                      "createdAt":"2020-01-13T06:47:41.248Z",
                      "updatedAt":"2020-01-13T06:47:41.248Z"
                    }

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


/*********************************************************************/
