const express = require("express");
const router = express.Router();

router.use(require('./login/login.route'));
router.use(require('./confirm-2fa/confirm-2fa.route'));
router.use(require('./logout/logout.route'));
router.use(require('./forgot-password/forgot-password.route'));
router.use(require('./set-new-password/set-new-password.route'));
router.use(require('./partner/partner.route'));
router.use(require('./staking-platform/staking-platform.route'));
router.use(require('./partner-tx-memo/partner-tx-memo.route'));
router.use(require('./account/account.route'));
router.use(require('./user/user.route'));
router.use(require('./role/role.route'));
router.use(require('./partner-commission/partner-commission.route')); 
router.use(require('./partner-api-key/partner-api-key.route'));
router.use(require('./partner/child/partner-child.route'));

module.exports = router;

/**********************************************************************/
/**
 * @swagger
 * definition:
 *   error:
 *     properties:
 *       message:
 *         type: string
 *       error:
 *         type: string
 *       code:
 *         type: string
 *       fields:
 *         type: object
 */

/**
 * @swagger
 * definition:
 *   200:
 *     properties:
 *       data:
 *         type: object
 *     example:
 *       data: true
 *
 */

/**
 * @swagger
 * definition:
 *   400:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Missing parameters
 *           error: error
 *           code: USER_NOT_FOUND
 *           fields: ['email']
 */

/**
 * @swagger
 * definition:
 *   401:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Unauthorized
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   403:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Forbidden
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   404:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Not Found
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   500:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Server Internal Error
 *           error: error
 *           code: USER_NOT_FOUND
 */