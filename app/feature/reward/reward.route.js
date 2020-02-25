const express = require('express');
const controller = require('app/feature/reward/reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

router.get(
  '/settings/rewards',
  authenticate,
  authority(Permission.VIEW_LIST_REWARD_SETTING),
  controller.get
);


/*********************************************************************/

/**
 * @swagger
 * /web/settings/rewards:
 *   get:
 *     summary: get reward setting
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
 *               data: {
 *                  items: [ { id: '5a4bc5ea-135f-4013-a30e-104bc1d11358',
                              staking_platform_id: '96b7f440-1a3b-11ea-978f-2e728ce88125',
                              platform: 'ETH',
                              commission: '80.00',
                              created_by: 5,
                              createdAt: '2020-01-13T03:15:23.525Z',
                              updatedAt: '2020-01-13T03:15:23.525Z' },
                            { id: '5a4bc5ea-135f-4013-a30e-104bc1d11359',
                              staking_platform_id: '96b7f440-1a3b-11ea-978f-2e728ce88126',
                              platform: 'ETH',
                              commission: '70.00',
                              created_by: 5,
                              createdAt: '2020-01-13T07:18:48.669Z',
                              updatedAt: '2020-01-13T07:18:48.669Z' } ],
                          offset: 0,
                          limit: 10,
                          total: 2
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

router.get(
  '/settings/rewards/histories',
  authenticate,
  authority(Permission.VIEW_HISTORY_REWARD_SETTING),
  controller.getHistory
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/settings/rewards/histories:
 *   get:
 *     summary: get reward setting history
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
 *             { data: { 
 *                limit: 10, offset: 0, total: 0, items: [] } }
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