const express = require('express');
const controller = require('app/feature/reward/reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');

const router = express.Router();

router.get(
  '/settings/rewards',
  authenticate,
  controller.get
);

/*********************************************************************/

/**
 * @swagger
 * /web/settings/reward:
 *   get:
 *     summary: get pay out
 *     tags:
 *       - Pay out
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             { data:
   [ { id: '5a4bc5ea-135f-4013-a30e-104bc1d11358',
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
       updatedAt: '2020-01-13T07:18:48.669Z' } ] }
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
  controller.getHistory
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/settings/reward/histories:
 *   get:
 *     summary: get pay out
 *     tags:
 *       - Pay out
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             { data: { size: 20, page: 1, total: 0, his: [] } }
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