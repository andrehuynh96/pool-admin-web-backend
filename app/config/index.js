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
  expiredVefiryToken: process.env.EXPIRED_VERIFY_TOKEN ? parseInt(process.env.EXPIRED_VERIFY_TOKEN) : 2,
  enableSeed: process.env.ENABLE_SEED == "1",
  websiteUrl: process.env.WEBSITE_URL,
  linkWebsiteVerify: process.env.WEBSITE_URL + '/set-new-password',
  linkWebsiteActiveUser: process.env.WEBSITE_URL + '/active-user',
  disableRecaptcha: true,
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
<<<<<<< HEAD
    ATOM: {
      gas: process.env.TX_CREATOR_ATOM_GAS_LIMIT ? parseInt(process.env.TX_CREATOR_ATOM_GAS_LIMIT) : 250000
    },
      keyId: process.env.TX_CREATOR_ATOM_KEY_ID,
      serviceId: process.env.TX_CREATOR_ATOM_SERVICE_ID,
      index: process.env.TX_CREATOR_ATOM_INDEX,
      feeDenom: process.env.TX_CREATOR_ATOM_FEEDENOM || 'uatom',
      testNet: process.env.TX_CREATOR_ATOM_TESTNET,
    },
    IRIS: {
      keyId: process.env.TX_CREATOR_IRIS_KEY_ID,
      serviceId: process.env.TX_CREATOR_IRIS_SERVICE_ID,
      index: process.env.TX_CREATOR_IRIS_INDEX,
      testNet: process.env.TX_CREATOR_IRIS_TESTNET,
      feeDenom: process.env.TX_CREATOR_IRIS_FEEDENOM || 'iris-atto',
      gas: process.env.TX_CREATOR_IRIS_GAS_LIMIT ? parseInt(process.env.TX_CREATOR_IRIS_GAS_LIMIT) : 50000,
      rateGasPrice: process.env.TX_CREATOR_IRIS_RATE_GAS_PRICE ? parseInt(process.env.TX_CREATOR_IRIS_RATE_GAS_PRICE) : 1e9
    XTZ: {
      keyId: process.env.TX_CREATOR_TEZOS_KEY_ID,
      serviceId: process.env.TX_CREATOR_TEZOS_SERVICE_ID,
      index: process.env.TX_CREATOR_TEZOS_INDEX,  
      testNet: process.env.TX_CREATOR_TEZOS_TESTNET,
      fee: process.env.TX_CREATOR_TEZOS_FEE
=======
>>>>>>> develop
    ETH: {
      keyId: process.env.ERC20_TX_CREATOR_KEY_ID,
      serviceId: process.env.ERC20_TX_CREATOR_SERVICE_ID,
      index: process.env.ERC20_TX_CREATOR_INDEX,
      testNet: process.env.ERC20_TX_CREATOR_TESTNET,
      fee: process.env.ERC20_ETH_GAS_PRICE,
<<<<<<< HEAD
<<<<<<< feature/staking-plan
      getAddressUrl: process.env.ERC20_GET_ADDRESS,
      signTxUrl: process.env.ERC20_SIGN_TX
=======
      gasLimit: process.env.ERC20_ETH_GAS_LIMIT
>>>>>>> update staking platforms
=======
      gasLimit: process.env.ERC20_ETH_GAS_LIMIT
>>>>>>> develop
    }
  },
  schedule: {
    erc20: {
      distributionReward: process.env.SCHEDULE_ERC20_REWARD_DISTRIBUTION,
      distributionCommission: process.env.SCHEDULE_ERC20_COMMISSION_DISTRIBUTION,
      checkTransaction: process.env.SCHEDULE_ERC20_CHECKTRANSACTION
    }
<<<<<<< HEAD
<<<<<<< feature/staking-plan
=======
=======
>>>>>>> develop
  },
  sdk: {
    apiKey: process.env.SDK_API_KEY,
    secret: process.env.SDK_SECRET_KEY,
    url: process.env.SDK_URL
<<<<<<< HEAD
>>>>>>> update staking platforms
=======
>>>>>>> develop
  }
};

module.exports = config;