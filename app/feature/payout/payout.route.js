const express = require('express');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./payout.request-schema');
const controller = require('./payout.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/staking/value-object/permission-key');

const router = express.Router();

module.exports = router; 