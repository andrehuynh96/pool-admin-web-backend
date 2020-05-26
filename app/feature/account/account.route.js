const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { changePassword, update, twofa, updateProfile } = require('./validator');
const controller = require('./account.controller');
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const config = require('app/config')

const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);

const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/me',
  authenticate,
  authority(Permission.VIEW_ACCOUNT),
  controller.getMe
);

router.post(
  '/me/change-password',
  authenticate,
  authority(Permission.CHANGE_PASSWORD_ACCOUNT),
  validator(changePassword),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller.changePassword
);


router.get(
  '/me/2fa',
  authenticate,
  authority(Permission.VIEW_2FA_ACCOUNT),
  controller.get2Fa
);

router.post(
  '/me/2fa',
  authenticate,
  authority(Permission.UPDATE_2FA_ACCOUNT),
  validator(twofa),
  controller.update2Fa
);


router.get(
  '/me/login-history',
  authenticate,
  authority(Permission.VIEW_LOGIN_HISTORY_ACCOUNT),
  controller.loginHistory
);

router.put(
  '/me/profile',
  authenticate,
  authority(Permission.UPDATE_PROFILE_ACCOUNT),
  validator(updateProfile),
  controller.updateProfile
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/me:
 *   get:
 *     summary: get proflie
 *     tags:
 *       - Accounts
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
 *                 "data":{
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED"
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



/*********************************************************************/

/**
 * @swagger
 * /web/me/change-password:
 *   post:
 *     summary: change password
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - password
 *            - new_password
  *            properties:
 *              password:
 *                type: string
 *              new_password:
 *                type: string
 *            example:
 *                  {
                          "password":"Abc123456",
                          "new_password":"123Abc123456",
                          "g-recaptcha-response":"fdsfdsjkljfsdfjdsfdhs"
 *                  }
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



/*********************************************************************/

/**
 * @swagger
 * /web/me/2fa:
 *   get:
 *     summary: get secret twofa
 *     tags:
 *       - Accounts
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
 *                 "data":"LNPGW5ZSIFUECJCBJ5OXWIKFERYEK6BDKZSHIL2YERDDUXSKKYSQ"
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
 * /web/me/2fa:
 *   post:
 *     summary: update 2fa
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - disable
 *            - twofa_code
  *            properties:
 *              twofa_secret:
 *                type: string
 *              twofa_code:
 *                type: string
 *              disable:
 *                type: boolean
 *            example:
 *                  {
                          "twofa_secret":"AIU45sdsahssdsjYUDHd6",
                          "twofa_code":"123456",
                          "disable":false
 *                  }
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
 * /web/me/login-history:
 *   get:
 *     summary: search login-history
 *     tags:
 *       - Accounts
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
                          "user_id":1,
                          "client_ip":"192.168.0.1",
                          "action":"LOGIN",
                          "user_agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                          "data":"",
                          "createdAt":"2020-01-13T06:47:41.248Z",
                          "updatedAt":"2020-01-13T06:47:41.248Z"
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
 * /web/me/profile:
 *   put:
 *     summary: update user profile
 *     tags:
 *       - Accounts
 *     description: update user profile
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to update.
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            - twofa_code
  *            properties:
 *              name:
 *                type: string
 *            example:
 *                  {
                        "name": "testttttttttt"
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": [
                        {
                            "id": 64,
                            "email": "yukirito131098@gmail.com",
                            "name": "testttttttttt",
                            "twofa_enable_flg": false,
                            "user_sts": "ACTIVATED",
                            "latest_login_at": "2020-04-15T04:51:47.775Z"
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