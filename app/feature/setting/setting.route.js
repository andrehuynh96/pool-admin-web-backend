const express = require('express');
const controller = require('./setting.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
    '/settings',
    authenticate,
    authority(Permission.VIEW_LIST_SETTING),
    controller.getAll
);

module.exports = router;
/*********************************************************************/

/**
 * @swagger
 * /web/settings:
 *   get:
 *     summary: get setting
 *     tags:
 *       - Setting
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
                "data": {
                    "items": [
                        {
                            "id": 1,
                            "key": "LOCKING_CONTRACT",
                            "value": "",
                            "created_by": 0,
                            "updated_by": 0,
                            "createdAt": "2020-03-06T10:31:25.074Z",
                            "updatedAt": "2020-03-06T10:31:25.074Z"
                        }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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
 */