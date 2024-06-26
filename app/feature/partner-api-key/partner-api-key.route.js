const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create } = require('./validator');
const controller = require('./partner-api-key.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/partners/:partner_id/keys',
  authenticate,
  authority(Permission.VIEW_LIST_KEY_PARTNER),
  controller.all
);

router.post(
  '/partners/:partner_id/keys',
  authenticate,
  authority(Permission.CREATE_KEY_PARTNER),
  validator(create),
  controller.create
);
router.delete(
  '/partners/:partner_id/keys/:id',
  authenticate,
  authority(Permission.DELETE_KEY_PARTNER),
  controller.delete
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/keys:
 *   post:
 *     summary: create partner key
 *     tags:
 *       - Api Key
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for api key.
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            example:
 *               {
                    "name":"key"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                        "id": "656b6f1c-1039-11ea-8d71-362b9e155667",
                        "api_key":"d485c3fd-31b0-496b-8d47-e357d8634075",
                        "secret_key":"q44EniuCImrmAiTDBtw3rlchK2P1tFLK",
                        "actived_flg": true,
                        "status":"NOT_CONNECT|CONNECTED"
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
* /web/partners/{partner_id}/keys:
*   get:
*     summary: get partner api keys
*     tags:
*       - Api Key
*     description:
*     parameters:
*       - in: path
*         name: partner_id
*         type: string
*         required: true
*       - name: actived_flg
*         in: query
*         type: boolean
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
                      "id": "656b6f1c-1039-11ea-8d71-362b9e155667",
                      "api_key":"d485c3fd-31b0-496b-8d47-e357d8634075",
                      "secret_key":"q44EniuCImrmAiTDBtw3rlchK2P1tFLK",
                      "actived_flg": true,
                      "status":"NOT_CONNECT|CONNECTED"
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
* /web/partners/{partner_id}/keys/{id}:
*   delete:
*     summary: revoke api key
*     tags:
*       - Api Key
*     description:
*     parameters:
*       - in: path
*         name: partner_id
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
*             {
*                 "data":{
                     "deleted": true
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
