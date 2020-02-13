const express = require('express');
const controller = require('./partner-child.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/partners/:partner_id/childs',
  authenticate,
  authority(Permission.VIEW_LIST_CHILD_PARTNER),
  controller.all
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/childs:
 *   get:
 *     summary: get childs
 *     tags: 
 *       - Child 
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
 *       - name: name
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: actived_flg
 *         in: query
 *         type: boolean
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  
               "data": {
                 "items": [{
                      "id": 1,
                      "email":"infinito@blockchainlabs.asia",
                      "name": "Infinito",
                      "partner_type": "AFFILIATE",
                      "created_at": "2020-01-07 20:22:04.728+09"
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


