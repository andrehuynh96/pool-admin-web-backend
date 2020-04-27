/*eslint no-process-env: "off"*/
require('dotenv').config();
const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  logger: {
    console: {
      enable: true,
      level: 'debug',
    },
    defaultLevel: 'debug',
    file: {
      compress: false,
      app: `${logFolder}/app.log`,
      error: `${logFolder}/error.log`,
      access: `${logFolder}/access.log`,
      format: '.yyyy-MM-dd',
    },
    appenders: ['CONSOLE', 'FILE', 'ERROR_ONLY'],
  },
  rateLimit: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
  db: {
    staking: {
      database: process.env.STAKING_DB_NAME,
      username: process.env.STAKING_DB_USER,
      password: process.env.STAKING_DB_PASS,
      options: {
        host: process.env.STAKING_DB_HOST,
        port: process.env.STAKING_DB_PORT,
        dialect: 'postgres',
        logging: false
      }
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX || 'staking:batch:commission:cache',
    usingPass: process.env.REDIS_USING_PASS || 0,
    pass: process.env.REDIS_PASS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE.toLowerCase() === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  mailSendAs: process.env.MAIL_SEND_AS || 'no-reply@infinito.io',
  website: {
    url: process.env.WEBSITE_URL,
    urlActive: process.env.WEBSITE_URL + '/active-user/',
    urlResetPassword: process.env.WEBSITE_URL + '/set-new-password/',
    urlConfirmNewIp: process.env.WEBSITE_URL + '/confirm-ip',
    urlApproveRequest: '/approve-request?token=',
    urlImages: process.env.PARTNER_NAME ? process.env.WEBSITE_URL + '/' + process.env.PARTNER_NAME.toLowerCase() : process.env.WEBSITE_URL,
  },
  emailTemplate: {
    partnerName: process.env.PARTNER_NAME,
    activeAccount: process.env.PARTNER_NAME.toLowerCase() + "/activate-account.ejs",
    resetPassword: process.env.PARTNER_NAME.toLowerCase() + "/reset-password.ejs",
    deactiveAccount: process.env.PARTNER_NAME.toLowerCase() + "/deactive-account.ejs",
    confirmingRequest: process.env.PARTNER_NAME.toLocaleLowerCase() + "/confirm-request.ejs"
  },
  expiredVefiryToken: process.env.EXPIRED_VERIFY_TOKEN ? parseInt(process.env.EXPIRED_VERIFY_TOKEN) : 2,
  enableSeed: process.env.ENABLE_SEED == "1",
  websiteUrl: process.env.WEBSITE_URL,
  linkWebsiteActiveUser: process.env.WEBSITE_URL + '/active-user',
  disableRecaptcha: process.env.DISABLE_RECAPTCHA == "1",
  CDN: {
    url: process.env.CDN_URL,
    accessKey: process.env.CDN_ACCESS_KEY,
    secretKey: process.env.CDN_SECRET_KEY,
    bucket: process.env.CDN_BUCKET,
    folderPlatform: process.env.CDN_FOLDER_PLATFORM,
    exts: process.env.CDN_FILE_EXT ? process.env.CDN_FILE_EXT.split(',')
      : [],
    fileSize: process.env.CDN_FILE_SIZE ? parseFloat(process.env.CDN_FILE_SIZE) : 5242880
  },
  enableDocsLink: process.env.ENABLE_DOCS_LINK == "1",
  appLimit: process.env.APP_LIMIT || 10,
  corsDomain: process.env.CORS_DOMAINS,
  aws: {
    endpoint: process.env.AWS_END_POINT,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET
  },
  txCreator: {
    host: process.env.TX_CREATOR_HOST,
    ETH: {
      keyId: process.env.ERC20_TX_CREATOR_KEY_ID,
      serviceId: process.env.ERC20_TX_CREATOR_SERVICE_ID,
      index: process.env.ERC20_TX_CREATOR_INDEX,
      testNet: process.env.ERC20_TX_CREATOR_TESTNET,
      fee: process.env.ERC20_ETH_GAS_PRICE,
      gasLimit: process.env.ERC20_ETH_GAS_LIMIT
    }
  },
  schedule: {
    erc20: {
      distributionReward: process.env.SCHEDULE_ERC20_REWARD_DISTRIBUTION,
      distributionCommission: process.env.SCHEDULE_ERC20_COMMISSION_DISTRIBUTION,
      checkTransaction: process.env.SCHEDULE_ERC20_CHECK_TRANSACTION
    }
  },
  sdk: {
    apiKey: process.env.SDK_API_KEY,
    secret: process.env.SDK_SECRET_KEY,
    url: process.env.SDK_URL
  },
  lockingContract: {
    address: process.env.LOCKING_CONTRACT_ADDRESS,
    createStakingPlatform: 'createPool',
    updateStakingMaxPayout: 'changePoolReserveAmount',
    createStakingPlan: 'addPlan',
    updateStakingPlan: 'changePlanStatus',
    getPoolInfo: 'getPoolInfo',
    deposit: 'deposit'
  },
  lockUser: {
    maximumTriesLogin: process.env.MAXIMUM_TRIES_LOGIN,
    lockTime: process.env.LOCK_TIME
  }
};

module.exports = config;