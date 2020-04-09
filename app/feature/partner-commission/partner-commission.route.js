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
 *               { items: [{
                        "id": "3c3ed477-a40e-439c-97ff-a404498ed5c1",     
                        "platform":"ATOM",
                        "commission":20
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
 *                 "data":[{
                      "id": "3c3ed477-a40e-439c-97ff-a404498ed5c1",     
                        "platform":"ATOM",
                        "commission":20,
                        "reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
                        "updated_at": "2020-01-07T11:22:04.602Z",
                        "updated_by": 0
                    }]
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
 *             {  "data": {
 *                 "items":[{
                        "id": "3c3ed477-a40e-439c-97ff-a404498ed5c1",     
                        "platform":"ATOM",
                        "commission":20,
                        "reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
                        "updated_at": "2020-01-07T11:22:04.602Z",
                        "updated_by": 0
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
 *             {  "data": {
 *                 "items":[{
                      "id": "3c3ed477-a40e-439c-97ff-a404498ed5c1",     
                        "platform":"ATOM",
                        "commission":20,
                        "reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
                        "updated_at": "2020-01-07T11:22:04.602Z",
                        "updated_by": 0
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
 *  
 */
