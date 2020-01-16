const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { create, update, } = require('./validator');
const controller = require('./user.contorller');
const config = require('app/config')

const router = express.Router();

router.get(
  '/users',
  authenticate,
  controller.search
);

router.get(
  '/users/:id',
  authenticate,
  controller.get
);

router.post(
  '/users',
  authenticate,
  validator(create),
  controller.create
);

router.put(
  '/users/:id',
  authenticate,
  validator(update),
  controller.update
);

router.delete(
  '/users/:id',
  authenticate,
  controller.delete
);


module.exports = router;




/*********************************************************************/


/**
 * @swagger
 * /web/users:
 *   get:
 *     summary: search user
 *     tags:
 *       - Users
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
 *       - name: user_sts
 *         in: query
 *         type: string  UNACTIVATED|ACTIVATED|LOCKED
 *       - name: query
 *         in: query
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "items": [
                        {
                          "id": 1,
                          "email":"example@gmail.com",
                          "twofa_secret":"sCM87xx",
                          "twofa_enable_flg": true,
                          "create_at":"",
                          "user_sts":"ACTIVATED"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 4
 *                 }
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




/*********************************************************************/


/**
 * @swagger
 * /web/users/{id}:
 *   get:
 *     summary: get user by id
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_secret":"sCM87xx",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "role_id":1
 *                 }
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


/*********************************************************************/


/**
 * @swagger
 * /web/users/{id}:
 *   delete:
 *     summary: get user by id
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
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


/*********************************************************************/

/**
 * @swagger
 * /web/users:
 *   post:
 *     summary: create user
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            example:
 *                  {
                          "email":"example@gmail.com",
                          "role":1
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_secret":"sCM87xx",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "role":1
 *                 }
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


/*********************************************************************/

/**
 * @swagger
 * /web/users/{id}:
 *   put:
 *     summary: update user
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            example:
 *                  {
                          "user_sts":"UNACTIVATED|ACTIVATED|LOCKED",
                          "role":1
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_secret":"sCM87xx",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "role":1
 *                 }
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