const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create } = require('./validator');
const controller = require('./partner-tx-memo.controller');

const router = express.Router();

router.get(
  '/partners/:partner_id/memos',
  controller.all
);

router.post(
  '/partners/:partner_id/memos',
  validator(create),
  controller.create
);
router.get(
  '/partners/:partner_id/memos/histories',
  controller.getHis
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/memos:
 *   post:
 *     summary: update partner memos
 *     tags:
 *       - Memo
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true  
 *       - in: body
 *         name: data
 *         description: Data for Partner.
 *         schema:
 *            type: array
 *            example:
 *               { items: [{     
                        "platform":"ATOM",
                        "memo":"Infinito:ATOM",
                        "default_flg": true
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
                      "id": "5cbe2366-1a55-11ea-978f-2e728ce88125",
                        "platform":"ATOM",
                        "memo":"Infinito:ATOM",
                        "default_flg": true,
                        "updated_at": "2020-01-07T11:22:04.602Z"
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
 *     summary: get partner memo
 *     tags:
 *       - Memo
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
 *             {
 *                 "data":[{
                      "id": "5cbe2366-1a55-11ea-978f-2e728ce88125",
                        "platform":"ATOM",
                        "memo":"Infinito:ATOM",
                        "default_flg": true
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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
 * /web/partners/{partner_id}/memos/histories:
 *   get:
 *     summary: get partner memo histories
 *     tags:
 *       - Memo
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
 *             {
 *                 "data":[{
                      "id": "5cbe2366-1a55-11ea-978f-2e728ce88125",
                        "platform":"ATOM",
                        "memo":"Infinito:ATOM",
                        "default_flg": true,
                        "updated_at": "2020-01-07 20:22:04.728+09"
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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
