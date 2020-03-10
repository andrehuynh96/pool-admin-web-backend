const express = require('express');
const controller = require('./staking-payout.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/staking-payouts',
  authenticate,
  authority(Permission.VIEW_LIST_PAYOUT_STAKING_PLATFORM),
  controller.getAll
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/staking-payouts:
 *   get:
 *     summary: get staking-payout
 *     tags:
 *       - staking-payout
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
 *             {
                "data": {
                    "items": [
                        {
                            "id": 2,
                            "staking_platform_id": "96b7f440-1a3b-11ea-978f-2e728ce88125",
                            "erc20_payout_id": 3,
                            "platform": "ETH",
                            "token_name": "Infinito",
                            "token_symbol": "INFT",
                            "token_address": "0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                            "max_payout": 100,
                            "actived_flg": true,
                            "created_by": 65,
                            "updated_by": 65,
                            "tx_id": "0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                            "wait_blockchain_confirm_status_flg": false,
                            "createdAt": "2020-03-09T09:23:50.627Z",
                            "updatedAt": "2020-03-09T09:23:50.627Z"
                        }
                    ],
                    "offset": 0,
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