const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { update } = require('./validator');
const controller = require('./partner-request.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.put(
    '/partners/:partner_id/commissions/:commission_id/requests/:id',
    validator(update),
    authenticate,
    authority(Permission.UPDATE_PARTNER_REQUEST_CHANGE_REWARD_ADDRESS),
    controller.update
);

router.get(
    '/partners/:partner_id/requests',
    authenticate,
    authority(Permission.GET_LIST_PARTNER_REQUEST_CHANGE_REWARD_ADDRESS),
    controller.getAll
);

router.get(
    '/partners/:partner_id/commissions/:partner_commission_id/requests/:id',
    authenticate,
    authority(Permission.GET_PARTNER_REQUEST_CHANGE_REWARD_ADDRESS),
    controller.get
);
  
  module.exports = router;
  
  
/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/commissions/{commission_id}/requests/{id}:
 *   put:
 *     summary: update payout
 *     tags:
 *       - Requests
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: commission_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: object
 *            required:
 *            - status
 *            example:
 *               {     
                    "status": 2,
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


/**
* @swagger
* /web/partners/{partner_id}/requests:
*   get:
*     summary: get all request change reward address
*     tags:
*       - Requests
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
*             {  "data": {
 *                 "items":[{
                        "id": "24c39b32-2d13-11ea-978f-2e728ce88125",
                        "partner_id": "ed483de6-2d14-11ea-978f-2e728ce88125",
                        "partner_commission_id": "f62634d4-30f9-11ea-aec2-2e728ce88125",     
                        "platform":"ATOM",
                        "reward_address":"iaa16se3zaex588aqa6e0mgnps92a005mjm95d56jx",
                        "status": 1,
                        "updated_at": "2020-01-07T11:22:04.602Z",
                        "created_at": "2020-01-07T11:22:04.602Z"
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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

/**
* @swagger
* /web/partners/{partner_id}/commissions/{partner_commission_id}/requests/{id}:
*   get:
*     summary: get request change reward address
*     tags:
*       - Requests
*     description:
*     parameters:
*       - in: path
*         name: partner_id
*         type: string
*         required: true
*       - in: path
*         name: partner_commission_id
*         type: string
*         required: true
*       - in: path
*         name: id
*         type: string
*         required: true
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {  "data": {
                        "id": "24c39b32-2d13-11ea-978f-2e728ce88125",
                        "partner_id": "ed483de6-2d14-11ea-978f-2e728ce88125",
                        "partner_commission_id": "f62634d4-30f9-11ea-aec2-2e728ce88125",     
                        "platform":"ATOM",
                        "reward_address":"iaa16se3zaex588aqa6e0mgnps92a005mjm95d56jx",
                        "status": 1,
                        "updated_at": "2020-01-07T11:22:04.602Z",
                        "created_at": "2020-01-07T11:22:04.602Z"
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
