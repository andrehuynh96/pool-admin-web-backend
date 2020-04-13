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
    controller
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