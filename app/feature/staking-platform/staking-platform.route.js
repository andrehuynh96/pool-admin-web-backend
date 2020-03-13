const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { create, update, updateERC20, createERC20 } = require('./validator');
const controller = require('./staking-platform.controller');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/staking-platforms/time-unit',
  authenticate,
  authority(Permission.VIEW_TIME_UNIT_STAKING_PLATFORM),
  controller.timeUnit
);

router.get(
  '/staking-platforms/config',
  authenticate,
  authority(Permission.VIEW_STAKING_PLATFORM_CONFIG),
  controller.config
);

router.get(
  '/staking-platforms',
  authenticate,
  authority(Permission.VIEW_LIST_STAKING_PLATFORM),
  controller.getAll
);

router.get(
  '/staking-platforms/:id',
  authenticate,
  authority(Permission.VIEW_STAKING_PLATFORM),
  controller.get
);

router.put(
  '/staking-platforms/:id',
  parseformdata,
  authenticate,
  authority(Permission.UPDATE_STAKING_PLATFORM),
  validator(update),
  controller.update
);

router.post(
  '/staking-platforms',
  parseformdata,
  authenticate,
  authority(Permission.CREATE_STAKING_PLATFORM),
  validator(create),
  controller.create
);

router.put(
  '/staking-platforms/erc20/:id',
  parseformdata,
  authenticate,
  authority(Permission.UPDATE_STAKING_PLATFORM),
  validator(updateERC20),
  controller.updateERC20
);

router.post(
  '/staking-platforms/erc20',
  parseformdata,
  authenticate,
  authority(Permission.CREATE_STAKING_PLATFORM),
  validator(createERC20),
  controller.createERC20
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
 * /web/staking-platforms/config:
 *   get:
 *     summary: get platform config
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
 *                "data": [
                    {
                      "name": "Ethereum",
                      "symbol": "ETH"
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
 *       - name: status
 *         in: query
 *         type: integer
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
                          "platform": "ETH",
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
                          "status":1,
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
                      "platform": "ETH",
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
                      "status":1,
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
 *     summary: update native staking platform
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
 *              platform:
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
 *              status:
 *                type: number
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
                          "status":1,
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
 *                 "data": {
                      "id": "061fc95f-7a84-4e03-8756-a482b390bd3d",
                      "order_index": 0,
                      "estimate_earn_per_year": "0",
                      "lockup_unvote": 0,
                      "lockup_unvote_unit": "DAY",
                      "payout_reward": 0,
                      "payout_reward_unit": "DAY",
                      "confirmation_block": 5,
                      "deleted_flg": false,
                      "name": "ETH_testttttttt",
                      "platform": "Ethereum",
                      "symbol": "ETH",
                      "staking_type": "CONTRACT",
                      "sc_token_address": "0x423822D571Bb697dDD993c04B507dD40E754cF05",
                      "erc20_validator_fee": "20",
                      "erc20_reward_estimate": "10%~20%",
                      "erc20_duration": "10 ~ 20 days",
                      "icon": "https://terraform-state-web-wallet.s3.ap-southeast-1.amazonaws.com/images/default-1583898984222.jpg",
                      "updated_by": 64,
                      "created_by": 64,
                      "status": -1,
                      "wait_blockchain_confirm_status_flg": true,
                      "updatedAt": "2020-03-11T03:56:24.844Z",
                      "createdAt": "2020-03-11T03:56:24.844Z",
                      "description": null,
                      "sc_lookup_addr": null,
                      "validator_address": null,
                      "tx_id": null
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
 *     summary: create native staking platform
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
 *              platform:
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
 *              status:
 *                type: number
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
                          "platform":"Ethereum",
                          "symbol":"ETH",
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":99,
                          "estimate_earn_per_year":"10",
                          "lockup_unvote":21,
                          "lockup_unvote_unit":"DAY",
                          "payout_reward":0,
                          "payout_reward_unit":"DAY",
                          "status":1,
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
 *                 "data": {
                      "id": "061fc95f-7a84-4e03-8756-a482b390bd3d",
                      "order_index": 0,
                      "estimate_earn_per_year": "0",
                      "lockup_unvote": 0,
                      "lockup_unvote_unit": "DAY",
                      "payout_reward": 0,
                      "payout_reward_unit": "DAY",
                      "confirmation_block": 5,
                      "deleted_flg": false,
                      "name": "ETH_testttttttt",
                      "platform": "Ethereum",
                      "symbol": "ETH",
                      "staking_type": "CONTRACT",
                      "sc_token_address": "0x423822D571Bb697dDD993c04B507dD40E754cF05",
                      "erc20_validator_fee": "20",
                      "erc20_reward_estimate": "10%~20%",
                      "erc20_duration": "10 ~ 20 days",
                      "icon": "https://terraform-state-web-wallet.s3.ap-southeast-1.amazonaws.com/images/default-1583898984222.jpg",
                      "updated_by": 64,
                      "created_by": 64,
                      "status": -1,
                      "wait_blockchain_confirm_status_flg": true,
                      "updatedAt": "2020-03-11T03:56:24.844Z",
                      "createdAt": "2020-03-11T03:56:24.844Z",
                      "description": null,
                      "sc_lookup_addr": null,
                      "validator_address": null,
                      "tx_id": null
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

/**
 * @swagger
 * /web/staking-platforms/erc20/{id}:
 *   put:
 *     summary: update erc20 staking platform
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
 *              staking_type:
 *                type: string
 *              erc20_validator_fee:
 *                type: number
 *              erc20_reward_estimate:
 *                type: string
 *              erc20_duration:
 *                type: string
 *            example:
 *                  {
                      "name": "Infinitooooooooo",
                      "symbol": "INFT",
                      "icon": "https://static.chainservices.info/staking/platforms/eth.png",
                      "staking_type": "CONTRACT",
                      "erc20_validator_fee": 20,
                      "erc20_reward_estimate": "10%~20%",
                      "erc20_duration": "10 ~ 20 days"
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "id": "061fc95f-7a84-4e03-8756-a482b390bd3d",
                      "order_index": 0,
                      "estimate_earn_per_year": "0",
                      "lockup_unvote": 0,
                      "lockup_unvote_unit": "DAY",
                      "payout_reward": 0,
                      "payout_reward_unit": "DAY",
                      "confirmation_block": 5,
                      "deleted_flg": false,
                      "name": "ETH_testttttttt",
                      "platform": "Ethereum",
                      "symbol": "ETH",
                      "staking_type": "CONTRACT",
                      "sc_token_address": "0x423822D571Bb697dDD993c04B507dD40E754cF05",
                      "erc20_validator_fee": "20",
                      "erc20_reward_estimate": "10%~20%",
                      "erc20_duration": "10 ~ 20 days",
                      "icon": "https://terraform-state-web-wallet.s3.ap-southeast-1.amazonaws.com/images/default-1583898984222.jpg",
                      "updated_by": 64,
                      "created_by": 64,
                      "status": -1,
                      "wait_blockchain_confirm_status_flg": true,
                      "updatedAt": "2020-03-11T03:56:24.844Z",
                      "createdAt": "2020-03-11T03:56:24.844Z",
                      "description": null,
                      "sc_lookup_addr": null,
                      "validator_address": null,
                      "tx_id": null
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

/**
 * @swagger
 * /web/staking-platforms/erc20:
 *   post:
 *     summary: create erc20 staking platform
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
 *            - icon
 *            - max_payout
 *            properties:
 *              name:
 *                type: string
 *              platform:
 *                type: string
 *              symbol:
 *                type: string
 *              icon:
 *                type: image
 *              staking_type:
 *                type: string
 *              sc_token_address:
 *                type: string
 *              erc20_validator_fee:
 *                type: number
 *              erc20_reward_estimate:
 *                type: string
 *              erc20_duration:
 *                type: string
 *              status:
 *                type: number
 *              max_payout:
 *                type: number
 *            example:
 *                  {
                      "name": "Infinitooooooooooooo",
                      "platform": "Ethereum",
                      "symbol": "INFT",
                      "icon": "https://static.chainservices.info/staking/platforms/eth.png",
                      "staking_type": "CONTRACT",
                      "sc_token_address": "0x5c1e0136B1D5781C9a5978e7dd059158Eb895BBB",
                      "erc20_validator_fee": 20,
                      "erc20_reward_estimate": "10%~20%",
                      "erc20_duration": "10 ~ 20 days",
                      "status": 1,
                      "max_payout": 110
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "id": "23ed17e4-61cd-4c01-b594-4d84a6f65ea8",
                      "order_index": 0,
                      "estimate_earn_per_year": "0",
                      "lockup_unvote": 0,
                      "lockup_unvote_unit": "DAY",
                      "payout_reward": 0,
                      "payout_reward_unit": "DAY",
                      "confirmation_block": 5,
                      "deleted_flg": false,
                      "wait_blockchain_confirm_status_flg": false,
                      "name": "Infinitooooooooooooo",
                      "platform": "Ethereum",
                      "symbol": "INFT",
                      "staking_type": "CONTRACT",
                      "sc_token_address": "0x5c1e0136B1D5781C9a5978e7dd059158Eb895BBB",
                      "erc20_validator_fee": "20",
                      "erc20_reward_estimate": "10%~20%",
                      "erc20_duration": "10 ~ 20 days",
                      "status": 1,
                      "icon": "https://terraform-state-web-wallet.s3.ap-southeast-1.amazonaws.com/images/default-1583909639932.jpg",
                      "updated_by": 64,
                      "created_by": 64,
                      "updatedAt": "2020-03-11T06:54:00.429Z",
                      "createdAt": "2020-03-11T06:54:00.429Z",
                      "description": null,
                      "sc_lookup_addr": null,
                      "validator_address": null,
                      "tx_id": null
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
 