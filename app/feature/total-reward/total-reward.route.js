const express = require('express');
const router = express.Router();
const controller = require('./total-reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/staking/value-object/permission-key');

router.get('/total-rewards',
  authenticate,
  authority(PermissionKey.VIEW_TOTAL_REWARD),
  controller.get
);

module.exports = router;
