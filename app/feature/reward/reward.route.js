const express = require('express');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./reward.request-schema');
const controller = require('./reward.controller');

const router = express.Router();

router.get(
  '/settings/commissions',
  controller.get
);

/*********************************************************************/

/**
 * @swagger
 * /web/settings/commissions:
 *   get:
 *     summary: get pay out
 *     tags:
 *       - Pay out
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": []
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

router.put(
  '/settings/commissions',
  validator(requestSchema),
  controller.update
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/settings/commissions:
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
 *            type: array
 *            example:
 *               [{
                        "id":1,
                        "max_payout":100,
                  }]
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