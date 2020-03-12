const abi = require('ethereumjs-abi');
const config = require('app/config');
const txCreator = require('app/lib/tx-creator');
const BN = require('bn.js');
const Transaction = require('ethereumjs-tx').Transaction;
const locking = require('./Locking.json');
const InfinitoApi = require('node-infinito-api');

const opts = {
    apiKey: config.sdk.apiKey,
    secret: config.sdk.secret,
    baseUrl: config.sdk.url
};
const api = new InfinitoApi(opts);
let coinAPI = api.ETH;

module.exports = {
    createStakingPlatform: async (_poolId, _poolName, _tokenAddr, _reserveTokenAmount, _needWhitelist) => {
        // var encoded = abi.encode(locking, "createPool(uint256,string,address,uint256,bool)", ['1','1','1','1','1'])
        // _getTestToken();
        let max_payout = new BN(_reserveTokenAmount, 10);
        console.log('max_payout', max_payout.toString('hex'));
        let sig = abi.methodID('createPool', ['uint256', 'string', 'address', 'uint256', 'bool']);
        let encoded = abi.rawEncode(['uint256', 'string', 'address', 'uint256', 'bool'], [
            "0x" + _poolId.replace(/-/g, ''),
            _poolName,
            _tokenAddr,
            max_payout.toString('hex'),
            _needWhitelist
        ]);
        console.log(_poolId);
        sig = sig.toString('hex') + encoded.toString('hex');
        let ret = await _constructAndSignTx('0x' + sig);
        return ret;
    },
    updateStakingMaxPayout: async (_poolId, _newAmount) => {

    },
    createStakingPlan: async (_poolId, _planId, _lockDuration, _annualInterestRate) => {

    },
    updateStakingPlan: async (_planId, _isClosed) => {

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
        if (tx_raw && tx_id) resolve({ tx_raw, tx_id });
        else reject('Sign transaction failed');
        await coinAPI.sendTransaction({ rawtx: tx_raw });
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
        // console.log(txParams);
        let tx = new Transaction(txParams, { chain: config.txCreator.ETH.testNet === 1 ? 'ropsten' : 'mainnet' });
        let { tx_raw, tx_id } = await txCreator.sign({ raw: tx.serialize().toString('hex') });
        if (tx_raw && tx_id) resolve({ tx_raw, tx_id });
        else reject('Sign transaction failed');
        await coinAPI.sendTransaction({ rawtx: tx_raw });
    })
}
