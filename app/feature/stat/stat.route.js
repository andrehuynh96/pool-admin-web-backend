const express = require('express');
const controller = require('./stat.controller');
const authenticate = require('app/middleware/authenticate.middleware');

const router = express.Router();

router.get(
  '/partners/:partner_id/stats',
  authenticate,
  controller.countUser
);

router.get(
  '/partners/:partner_id/stats/commissions',
  authenticate,
  controller.sumCommission
);

router.get(
  '/partners/:partner_id/stats/charts',
  authenticate,
  controller.drawChart
)

router.get(
  '/partners/:partner_id/stats/charts/commissions',
  authenticate,
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
 *             {
                "data": {
                  "items": [
                    {
                      "platform": "XTZ",
                      "user": "1",
                      "balance": 100
                    },
                    {
                      "platform": "ATOM",
                      "user": 2,
                      "balance": 2287
                    }
                  ]
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
 *             {
                "data": {
                  "items": [
                    {
                      "platform": "ATOM",
                      "amount": 12192085355210800000
                    },
                    {
                      "platform": "IRIS",
                      "amount": 3.65849006618403e+21
                    },
                    {
                      "platform": "XTZ",
                      "amount": 3747003
                    }
                  ]
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
 *             {
                "data": {
                  "items": [
                    {
                      "platform": "XTZ",
                      "data": {
                        "day": [
                          {
                            "day": 31,
                            "month": 12,
                            "year": 2019,
                            "user": "1",
                            "balance": 100
                          }
                        ],
                        "week": [
                          {
                            "week": 1,
                            "year": 2019,
                            "user": "1",
                            "balance": 100
                          }
                        ],
                        "month": [
                          {
                            "month": 12,
                            "year": 2019,
                            "user": "1",
                            "balance": 100
                          }
                        ]
                      }
                    }
                  ]
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
 *             {
                  "data": {
                    "items": [
                      {
                        "platform": "XTZ",
                        "data": {
                          "day": [
                            {
                              "day": 9,
                              "month": 1,
                              "year": 2020,
                              "amount": 2647635
                            },
                            {
                              "day": 14,
                              "month": 1,
                              "year": 2020,
                              "amount": 1099368
                            }
                          ],
                          "week": [
                            {
                              "week": 2,
                              "year": 2020,
                              "amount": 2647635
                            },
                            {
                              "week": 3,
                              "year": 2020,
                              "amount": 1099368
                            }
                          ],
                          "month": [
                            {
                              "month": 1,
                              "year": 2020,
                              "amount": 3747003
                            }
                          ]
                        }
                      }
                    ]
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
 *  
 */