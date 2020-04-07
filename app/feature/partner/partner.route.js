const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');
const controller = require('./partner.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.post(
  '/partners',
  authenticate,
  authority(Permission.CREATE_PARTNER),
  validator(create),
  controller.create
);

router.get(
  '/partners',
  authenticate,
  authority(Permission.VIEW_LIST_PARTNER),
  controller.all
);

router.put(
  '/partners/:partner_id',
  authenticate,
  authority(Permission.UPDATE_PARTNER),
  validator(update),
  controller.update
);

router.get(
  '/partners/:partner_id',
  authenticate,
  authority(Permission.VIEW_PARTNER),
  controller.get
);

router.delete(
  '/partners/:partner_id',
  authenticate,
  authority(Permission.DELETE_PARTNER),
  controller.delete
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/partners:
 *   post:
 *     summary: create partner
 *     tags:
 *       - Partner
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for Partner.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - name
 *            example:
 *               {
                        "email":"infinito@blockchainlabs.asia",
                        "name":"Infinito",
                        "parent_id": null,
                        "partner_type": "AFFILIATE"
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
                      "id": 1,
                      "email":"infinito@blockchainlabs.asia",
                      "name": "Infinito",
                      "partner_type": "AFFILIATE"
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
 *   get:
 *     summary: get partners
 *     tags: 
 *       - Partner 
 *     description:
 *     parameters:
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
 *       - name: root
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

/**
 * @swagger
 * /web/partners/{partner_id}:
 *   put:
 *     summary: update partner
 *     tags:
 *       - Partner
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
 *            type: object
 *            example:
 *               {
                        "email":"infinito@blockchainlabs.asia",
                        "name":"Infinito",
                        "parent_id": "1223",
                        "partner_type": "AFFILIATE"
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
                      "id": 1,
                      "email":"infinito@blockchainlabs.asia",
                      "name": "Infinito",
                      "partner_type": "AFFILIATE"
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
 *   get:
 *     summary: get partner info
 *     tags:
 *       - Partner
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
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
                      "id": 1,
                      "email":"infinito@blockchainlabs.asia",
                      "name": "Infinito",
                      "partner_type": "AFFILIATE"
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
 *   delete:
 *     summary: delete partner
 *     tags:
 *       - Partner
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
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
 */
