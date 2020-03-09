const cron = require('node-cron');
const config = require('app/config');
const logger = require('app/lib/logger');
const runWithLockFile = require('app/lib/run-lock-file');
const CHECK_ERC20_EVENT_LOCK_FILE = 'check_erc20_event.lock';
const WithdrawalJob = require("./job/check-erc20-event.job");

module.exports = {
  run: () => {
    cron.schedule(config.schedule.checkTransaction, async () => {
      await runWithLockFile(WithdrawalJob, CHECK_ERC20_EVENT_LOCK_FILE, "check erc20 event batch");
    });
  }
}