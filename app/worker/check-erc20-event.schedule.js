const cron = require('node-cron');
const config = require('app/config');
const logger = require('app/lib/logger');
const runWithLockFile = require('app/lib/run-lock-file');
const CHECK_ERC20_EVENT_LOCK_FILE = 'check_erc20_event.lock';
const CheckTransactionJob = require("./job/check-erc20-event.job");

module.exports = {
  run: () => {
    cron.schedule(config.schedule.erc20.checkTransaction, async() => {
      logger.info('Run check transaction');
      await runWithLockFile(CheckTransactionJob, CHECK_ERC20_EVENT_LOCK_FILE, "check erc20 event batch");
    });
  }
}