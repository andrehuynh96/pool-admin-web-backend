const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');
const controller = require('./partner.controller');

const router = express.Router();

router.post(
  '/partners',
  validator(create),
  controller.create
);

router.get(
  '/partners',
  controller.all
);

router.put(
  '/partners/:partner_id',
  validator(update),
  controller.update
);

router.get(
  '/partners/:partner_id',
  controller.get
);

router.delete(
  '/partners/:partner_id',
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
                        "name":"Infinito"
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
                      "name": "Infinito"
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
 *       - name: "offset"
 *         in: "query"
 *         type: "integer"
 *         format: "int32"
 *       - name: "limit"
 *         in: "query"
 *         type: "integer"
 *         format: "int32"
 *       - name: "name"
 *         in: "query"
 *         type: "string"
 *       - name: "email"
 *         in: "query"
 *         type: "string"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": [{
                      "id": 1,
                      "email":"infinito@blockchainlabs.asia",
                      "name": "Infinito"
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
 */