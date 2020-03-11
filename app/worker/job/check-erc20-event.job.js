const logger = require("app/lib/logger");

module.exports = {
  execute: async () => {
    try {
      
    }
    catch (err) {
      logger.error("check-erc20-even job error:", err);
    }
  }
}