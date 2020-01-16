const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const controller = require('./role.controller');

const router = express.Router();

router.get(
  '/roles',
  authenticate,
  controller.getAll
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/roles:
 *   get:
 *     summary: get role
 *     tags:
 *       - Roles
 *     description:
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":[
                      {
                        "id":1,
                        "name":"Admin",
                        "description":null,
                        "deleted_flg":false,
                        "createdAt":"2020-01-16T07:17:26.158Z",
                        "updatedAt":"2020-01-16T07:17:26.158Z"
                      }
                    ]
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

