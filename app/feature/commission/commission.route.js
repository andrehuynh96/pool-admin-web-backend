const express = require('express');;
const controller = require('app/feature/commission/commission.controller');

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
 *            { data:
   [ { id: 'a92b8ebc-256a-11ea-978f-2e728ce88125',
       platform: 'ATOM',
       cycle: 1000,
       cycle_type: 'BLOCK',
       min_amount: 2000,
       amount_unit: 'ATOM',
       created_by: 5,
       createdAt: '2019-08-02T03:00:00.000Z',
       updatedAt: '2019-12-23T10:05:02.989Z' },
     { id: 'a92b8ebc-256a-11ea-978f-2e728ce88126',
       platform: 'XTZ',
       cycle: 3,
       cycle_type: 'CYCLE',
       min_amount: 1000000,
       amount_unit: 'ATOM',
       created_by: 5,
       createdAt: '2019-08-02T03:00:00.000Z',
       updatedAt: '2019-08-02T03:00:00.000Z' },
     { id: 'a92b913c-256a-11ea-978f-2e728ce88125',
       platform: 'IRIS',
       cycle: 1000,
       cycle_type: 'BLOCK',
       min_amount: 1000000,
       amount_unit: 'IRIS',
       created_by: 5,
       createdAt: '2019-08-02T03:00:00.000Z',
       updatedAt: '2019-08-02T03:00:00.000Z' } ] }
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
  '/settings/commissions/history',
  controller.getHistory
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/settings/commissions/history?size={size}&page={page}:
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
 *           { data: { size: 20, page: 1, total: 0, his: [] } }
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