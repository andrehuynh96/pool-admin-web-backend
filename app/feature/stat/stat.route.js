const express = require('express');
const controller = require('./stat.controller');

const router = express.Router();

router.get(
  '/partners/:partner_id/stats',
  controller.countUser
);

router.get(
  '/partners/:partner_id/stats/commissions',
  controller.sumCommission
);

router.get(
  '/partners/:partner_id/stats/charts',
  controller.drawChart
)

router.get(
  '/partners/:partner_id/stats/charts/commissions',
  controller.drawCommission
)

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/stats:
 *   get:
 *     summary: get partner stat
 *     tags:
 *       - Stat
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true 
 *       - name: from
 *         in: query
 *         type: string
 *         format: date
 *         required: true
 *       - name: to
 *         in: query
 *         type: string
 *         format: date
 *         required: true 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  "data": {
 *                 "items":[{
                        "platform":"ATOM",
                        "user":100,
                        "balance": 1000
                    }]
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
 * /web/partners/{partner_id}/stats/commissions:
 *   get:
 *     summary: get partner stat
 *     tags:
 *       - Stat
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true 
 *       - name: from
 *         in: query
 *         type: string
 *         format: date
 *         required: true
 *       - name: to
 *         in: query
 *         type: string
 *         format: date
 *         required: true 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  "data": {
 *                 "items":[{
                        "platform":"ATOM",
                        "amount": 1000
                    }]
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
 * /web/partners/{partner_id}/stats/charts:
 *   get:
 *     summary: get partner stat chart
 *     tags:
 *       - Stat
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true 
 *       - name: from
 *         in: query
 *         type: string
 *         format: date
 *         required: true
 *       - name: to
 *         in: query
 *         type: string
 *         format: date
 *         required: true 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  "data": {
 *                 "items":[{
                        "platform":"ATOM",
                        "data": {
                          "day": [{
                            "date": "2019-01-01",
                            "user": 1,
                            "balance": 100
                          }],
                          week: [],
                          month: []
                        }
                    }]
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
 * /web/partners/{partner_id}/stats/charts/commissions:
 *   get:
 *     summary: get partner stat commission chart
 *     tags:
 *       - Stat
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true 
 *       - name: from
 *         in: query
 *         type: string
 *         format: date
 *         required: true
 *       - name: to
 *         in: query
 *         type: string
 *         format: date
 *         required: true 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  "data": {
 *                 "items":[{
                        "platform":"XTZ",
                        "data": {
                          "day": [{
                            "date": "2019-01-01",
                            "amount": 100
                          }],
                          week: [],
                          month: []
                        }
                    }]
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