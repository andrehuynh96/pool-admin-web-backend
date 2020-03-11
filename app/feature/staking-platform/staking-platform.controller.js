const logger = require('app/lib/logger');
const { Op } = require("sequelize");
const StakingPlatform = require("app/model/staking").staking_platforms;
const Settings = require("app/model/staking").settings;
const ERC20EventPool = require("app/model/staking").erc20_event_pools;
const TimeUnit = require("app/model/staking/value-object/time-unit");
const PlatformConfig = require("app/model/staking/value-object/platform");
const StakingType = require("app/model/staking/value-object/staking-type");
const Minio = require("app/lib/cdn/minio");
const s3 = require('app/service/s3.service');
const path = require("path");
const config = require('app/config');
const toArray = require('stream-to-array');
const util = require('util');
const axios = require("axios");
const Transaction = require('ethereumjs-tx').Transaction;
const InfinitoApi = require('node-infinito-api');
const Web3 = require('web3');
const Eth = require('web3-eth');

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/ccb2e224843840dc99f3261937eb1900"));
const eth = new Eth(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/ccb2e224843840dc99f3261937eb1900"));

const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secret,
  baseUrl: config.sdk.url
}; 
const api = new InfinitoApi(opts);
let coinAPI = api.ETH;
let privKey = Buffer.from('a5fbd094cc939973432d5440739e28cba132701730583218641ab3d90aba8360', 'hex');
let myAddress = '0x5c1e0136B1D5781C9a5978e7dd059158Eb895BBB';

module.exports = {

  timeUnit: (req, res, next) => {
    try {
      let result = Object.values(TimeUnit);
      return res.ok(result);
    }
    catch (err) {
      logger.error('get timeUnit fail:', err);
      next(err);
    }
  },

  config: (req, res, next) => {
    try {
      let result = PlatformConfig;
      return res.ok(result);
    }
    catch (err) {
      logger.error('get config fail:', err);
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = {
        deleted_flg: false
      };
      if (req.query.staking_type) {
        where.staking_type = req.query.staking_type
      }
      if (req.query.status != undefined) {
        where.status = req.query.status
      }

      const { count: total, rows: items } = await StakingPlatform.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('getAll staking platform fail:', err);
      next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      let result = await StakingPlatform.findOne({
        where: {
          deleted_flg: false,
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("NOT_FOUND"), "NOT_FOUND");
      }
      
      return res.ok(result);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      let result = await StakingPlatform.findOne({
        where: {
          deleted_flg: false,
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("NOT_FOUND"), "NOT_FOUND");
      }

      if (result.wait_blockchain_confirm_status_flg)
        return res.badRequest(res.__("PLATFORM_IS_UNDER_BLOCKCHAIN_CONFIRMATION"), "PLATFORM_IS_UNDER_BLOCKCHAIN_CONFIRMATION");

      if (req.body.icon) {
        let file = path.parse(req.body.icon.file.name);
        if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
          return res.badRequest(res.__("UNSUPPORT_FILE_EXTENSION"), "UNSUPPORT_FILE_EXTENSION", { fields: ["icon"] });
        }

        req.body.icon = await _uploadFile(req, res, next);
      }

      if (req.user) {
        req.body.updated_by = req.user.id;
      }

      let [_, response] = await StakingPlatform.update({
        ...req.body
      }, {
        where: {
          id: result.id
        },
        returning: true
      })

      return res.ok(response[0]);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      if (req.body.icon) {
        let file = path.parse(req.body.icon.file.name);
        if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
          return res.badRequest(res.__("UNSUPPORT_FILE_EXTENSION"), "UNSUPPORT_FILE_EXTENSION", { fields: ["icon"] });
        }
        req.body.icon = await _uploadFile(req, res, next);
      }
      if (req.user) {
        req.body.created_by = req.user.id;
        req.body.updated_by = req.user.id;
      }
      let response = await StakingPlatform.create({
        ...req.body,
        updated_by: req.user.id,
        created_by: req.user.id
      });

      return res.ok(response);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },

  createERC20: async (req, res, next) => {
    try {
      let lockingAddress = await Settings.findOne({
        where: {
          key: 'LOCKING_CONTRACT'
        }
      });
      lockingAddress = lockingAddress.value;
      if (req.body.icon) {
        let file = path.parse(req.body.icon.file.name);
        if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
          return res.badRequest(res.__("UNSUPPORT_FILE_EXTENSION"), "UNSUPPORT_FILE_EXTENSION", { fields: ["icon"] });
        }
        req.body.icon = await _uploadFile(req, res, next);
      }
      let createPlatformResponse = await StakingPlatform.create({
        ...req.body,
        updated_by: req.user.id,
        created_by: req.user.id,
        // status: -1,
        // wait_blockchain_confirm_status_flg: true
      });

      if (!createERC20EventResponse) return res.serverInternalError();

      // let getAddressUrl = `${config.txCreator.host}/api/sign/${config.txCreator.ETH.keyId}/${req.body.symbol}/address/0`;
      // let address = await axios.get(getAddressUrl, {
      //   params: {
      //     testnet: config.txCreator.ETH.testNet
      //   }
      // });
      // address = address.data.data.address;
      // let balance = await eth.getBalance(myAddress);
      // console.log(address);
      // console.log('Account balance:', balance);
      // let transaction = new Transaction();
      // const txParams = {
      //   nonce: await eth.getTransactionCount(address),
      //   gasPrice: config.txCreator.ETH.fee,
      //   gasLimit: config.txCreator.ETH.gasLimit,
      //   from: address,
      //   to: myAddress,
      //   value: '0x100',
      //   data: '0x'
      // };
      // console.log(txParams);
      // tx = new Transaction(txParams, { chain: 'ropsten', hardfork: 'petersburg' });
      // console.log('0x' + tx.serialize().toString('hex'));
      // tx.sign(privKey);
      
      // var serializedTx = tx.serialize();
      // console.log(tx.validate());
      
      // await eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
  


      // let signTxUrl = `${config.txCreator.host}/api/sign/${config.txCreator.ETH.serviceId}/${config.txCreator.ETH.keyId}/${req.body.symbol}/address/0`;
      // console.log(signTxUrl);
      // let result = await axios.post(signTxUrl, 
      // {
      //   raw: unsignedTx.serialize().toString('hex')
      // },
      // {
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   params: {
      //     testnet: config.txCreator.ETH.testNet
      //   }
      // });
      // // console.log(result);
      // console.log(result);

      let newEvent = {
        name: 'CREATE_NEW_ERC20_STAKING_PLATFORM',
        description: 'Create new ERC20 staking id ' + createPlatformResponse.id,
        tx_id: '',
        updated_by: req.user.id,
        created_by: req.user.id,
        successful_event: `UPDATE public.staking_platforms SET wait_blockchain_confirm_status_flg = false, status = 1, tx_id = ${1} WHERE id = ${createPlatformResponse.id}`,
        fail_event: `DELETE FROM public.staking_platforms where id = ${createPlatformResponse.id}`
      };
      let createERC20EventResponse = await ERC20EventPool.create(newEvent);

      if (createERC20EventResponse) return res.ok(createPlatformResponse);
      else return res.serverInternalError();
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },

  updateERC20: async (req, res, next) => {
    try {
      let result = await StakingPlatform.findOne({
        where: {
          deleted_flg: false,
          id: req.params.id,
        }
      })

      if (!result) {
        return res.badRequest(res.__("NOT_FOUND"), "NOT_FOUND");
      }

      if (result.wait_blockchain_confirm_status_flg)
        return res.badRequest(res.__("PLATFORM_IS_UNDER_BLOCKCHAIN_CONFIRMATION"), "PLATFORM_IS_UNDER_BLOCKCHAIN_CONFIRMATION");

      if (req.body.icon) {
        let file = path.parse(req.body.icon.file.name);
        if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
          return res.badRequest(res.__("UNSUPPORT_FILE_EXTENSION"), "UNSUPPORT_FILE_EXTENSION", { fields: ["icon"] });
        }

        req.body.icon = await _uploadFile(req, res, next);
      }

      if (req.user) {
        req.body.updated_by = req.user.id;
      }

      let [_, response] = await StakingPlatform.update({
        ...req.body
      }, {
        where: {
          id: result.id
        },
        returning: true
      })

      return res.ok(response[0]);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },
}

async function _uploadFile(req, res, next) {
  return new Promise(async (resolve, reject) => {
    let file = path.parse(req.body.icon.file.name);
    if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
      reject("unsupport file ext");
    }
    let uploadName = `${config.CDN.folderPlatform}/${file.name}-${Date.now()}${file.ext}`;
    let buff = await toArray(req.body.icon.data).then(function (parts) {
      const buffers = parts.map(part => util.isBuffer(part) ? part : Buffer.from(part));
      return Buffer.concat(buffers);
    });
    let putObject = await s3.put(uploadName, buff, next);
    if (putObject) {
      let uploadUrl = encodeURI(`https://${config.aws.bucket}.${config.aws.endpoint.slice(config.aws.endpoint.lastIndexOf('//') + 2)}/${uploadName}`);
      resolve(uploadUrl);
    }
    else reject("upload file fail");
  });
}
