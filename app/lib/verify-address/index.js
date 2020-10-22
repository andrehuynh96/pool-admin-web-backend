const web3Util = require('web3-utils');
const bech32 = require('bech32');
const logger = require('app/lib/logger');
const NeonCore = require('@cityofzion/neon-core');
const WAValidator = require("multicoin-address-validator");
const { isValidAddress: isValidHarmonyAddress } = require('@harmony-js/utils');

module.exports = (platform, address) => {
  console.log(platform, address);
  if (platform === 'TADA') {
    platform === 'ADA';
  }

  if (platform == 'ATOM') {
    return verifyCosmosAddress(address);
  }

  if (platform == 'IRIS') {
    return verifyIrisAddress(address);
  }

  if (platform == 'ETH') {
    return verifyEthAddress(address);
  }

  if (platform == "ONT" || platform == "ONG") {
    return verifyOntAddress(address);
  }

  if (platform == 'ONE') {
    return verifyHarmonyAddress(address);
  }

  const valid = WAValidator.validate(address, platform.toLowerCase(), "testnet") || WAValidator.validate(address, platform.toLowerCase());

  return valid;
}

const verifyCosmosAddress = (address) => {
  try {
    let result = bech32.decode(address.toLowerCase());
    return result.prefix == 'cosmos';
  }
  catch (e) {
    logger.error(e);
    return false;
  }
}

const verifyIrisAddress = (address) => {
  try {
    let result = bech32.decode(address.toLowerCase());
    return result.prefix == 'iaa';
  }
  catch (e) {
    logger.error(e);
    return false;
  }
}

const verifyEthAddress = (address) => {
  try {
    if (!web3Util.isAddress(address)) {
      return false;
    }
    return web3Util.toChecksumAddress(address);
  } catch (e) {
    logger.error(e);
    return false;
  }
}

const verifyOntAddress = (address) => {
  try {
    return NeonCore.wallet.isAddress(address);
  } catch (e) {
    logger.error(e);
    return false;
  }
}

const verifyHarmonyAddress = (address) => {
  try {
    return isValidHarmonyAddress(address);
  } catch (e) {
    logger.error(e);
    return false;
  }
}
