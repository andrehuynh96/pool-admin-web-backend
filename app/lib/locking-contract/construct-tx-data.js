const abi = require('ethereumjs-abi');
const config = require('app/config');
const txCreator = require('app/lib/tx-creator');
const BN = require('bn.js');
const Transaction = require('ethereumjs-tx').Transaction;
const locking = require('./Locking.json');
const InfinitoApi = require('node-infinito-api');
const { secondDurationTime } = require('app/lib/utils');

const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secret,
  baseUrl: config.sdk.url
};
const api = new InfinitoApi(opts);
let coinAPI = api.ETH;

module.exports = {
  createStakingPlatform: async (_poolId, _poolName, _tokenAddr, _reserveTokenAmount, _needWhitelist) => {
    let max_payout = new BN(_reserveTokenAmount, 10);
    let decimal = await coinAPI.getContractInfo(_tokenAddr);
    if (decimal) {
      decimal = decimal.data.decimals;
    }
    else decimal = 0;
    max_payout = max_payout.mul(new BN((10 ** decimal).toString(), 10));
    let poolId = new BN(_poolId.replace(/-/g, ''), 16);
    let paramTypeList = locking.abi.find(ele => ele.type === 'function' && ele.name === config.lockingContract.createStakingPlatform).inputs.map(ele => ele.type);
    let sig = abi.methodID(
      config.lockingContract.createStakingPlatform,
      paramTypeList
    );
    let paramList = [
      poolId.toString(),
      _poolName,
      _tokenAddr,
      max_payout.toString(),
      _needWhitelist
    ];
    let encoded = abi.rawEncode(paramTypeList, paramList);
    let data = '0x' + sig.toString('hex') + encoded.toString('hex');
    let ret = await _constructAndSignTx(data);
    return ret;
  },
  updateStakingMaxPayout: async (_poolId, _newAmount, _tokenAddr) => {
    let amount = new BN(_newAmount, 10);
    let decimal = await coinAPI.getContractInfo(_tokenAddr);
    if (decimal) decimal = decimal.data.decimals;
    else decimal = 0;
    amount = amount.mul(new BN((10 ** decimal).toString(), 10));
    let poolId = new BN(_poolId.replace(/-/g, ''), 16);
    let paramTypeList = locking.abi.find(ele => ele.type === 'function' && ele.name === config.lockingContract.updateStakingMaxPayout).inputs.map(ele => ele.type);
    let sig = abi.methodID(
      config.lockingContract.updateStakingMaxPayout,
      paramTypeList
    );
    let paramList = [
      poolId.toString(),
      amount.toString()
    ];
    let encoded = abi.rawEncode(paramTypeList, paramList);
    let data = '0x' + sig.toString('hex') + encoded.toString('hex');
    let ret = await _constructAndSignTx(data);
    return ret;
  },
  getPoolInfo: async (_poolId, _newAmount) => {

  },
  createStakingPlan: async (_poolId, _planId, _lockDuration, _annualInterestRate) => {
    duration = secondDurationTime(_lockDuration.timeNumber, _lockDuration.type);
    let durationSecond = new BN(duration, 10);
    let interestRate = new BN(_annualInterestRate * 100, 10);
    let poolId = new BN(_poolId.replace(/-/g, ''), 16);
    let planId = new BN(_planId.replace(/-/g, ''), 16);
    let paramTypeList = locking.abi.find(ele => ele.type === 'function' && ele.name === config.lockingContract.createStakingPlan).inputs.map(ele => ele.type);
    let sig = abi.methodID(
      config.lockingContract.createStakingPlan,
      paramTypeList
    );
    let paramList = [
      poolId.toString(),
      planId.toString(),
      durationSecond.toString(),
      interestRate.toString()
    ];
    console.log('paramList', paramList);
    let encoded = abi.rawEncode(paramTypeList, paramList);
    let data = '0x' + sig.toString('hex') + encoded.toString('hex');
    let ret = await _constructAndSignTx(data);
    return ret;
  },
  updateStakingPlan: async (_planId, _isClosed) => {
    let paramTypeList = locking.abi.find(ele => ele.type === 'function' && ele.name === config.lockingContract.updateStakingPlan).inputs.map(ele => ele.type);
    let planId = new BN(_planId.replace(/-/g, ''), 16);
    let sig = abi.methodID(
      config.lockingContract.updateStakingPlan,
      paramTypeList
    );
    let paramList = [
      planId.toString(),
      _isClosed
    ];
    let encoded = abi.rawEncode(paramTypeList, paramList);
    let data = '0x' + sig.toString('hex') + encoded.toString('hex');
    let ret = await _constructAndSignTx(data);
    return ret;
  },
}

async function _getTestToken() {
  return new Promise(async (resolve, reject) => {
    let from = await txCreator.getAddress();
    let nonce = await coinAPI.getNonce(from);
    const txParams = {
      nonce: nonce.data.nonce,
      gasPrice: config.txCreator.ETH.fee,
      gasLimit: config.txCreator.ETH.gasLimit,
      from,
      to: '0x423822D571Bb697dDD993c04B507dD40E754cF05',
      value: '0x2386f26fc10000',
      data: '0x'
    };
    // console.log(txParams);
    let tx = new Transaction(txParams, { chain: config.txCreator.ETH.testNet === 1 ? 'ropsten' : 'mainnet' });
    let { tx_raw, tx_id } = await txCreator.sign({ raw: tx.serialize().toString('hex') });
    let ret = await coinAPI.sendTransaction({ rawtx: '0x' + tx_raw });
    console.log(tx_raw);
    if (ret.msg) reject('Broadcast tx failed: ' + ret.msg);
    if (tx_raw) resolve({ tx_raw, tx_id: ret.data.tx_id.replace('0x', '') });
    else reject('Sign and send transaction failed');
  })
}

async function _constructAndSignTx(data, value = '0x0') {
  return new Promise(async (resolve, reject) => {
    let from = await txCreator.getAddress();
    let nonce = await coinAPI.getNonce(from);
    const txParams = {
      nonce: nonce.data.nonce,
      gasPrice: config.txCreator.ETH.fee,
      gasLimit: config.txCreator.ETH.gasLimit,
      from,
      to: config.lockingContract.address,
      value,
      data
    };
    let tx = new Transaction(txParams, { chain: config.txCreator.ETH.testNet === 1 ? 'ropsten' : 'mainnet' });
    let { tx_raw, tx_id } = await txCreator.sign({ raw: tx.serialize().toString('hex') });
    let ret = await coinAPI.sendTransaction({ rawtx: '0x' + tx_raw });
    console.log(tx_raw);
    if (ret.msg) reject('Broadcast tx failed: ' + ret.msg);
    if (tx_raw) resolve({ tx_raw, tx_id: ret.data.tx_id.replace('0x', '') });
    else reject('Sign and send transaction failed');
  })
}