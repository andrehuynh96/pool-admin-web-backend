const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
const speakeasy = require("speakeasy");
const OTP = require("app/model/staking").otps;
const OtpType = require("app/model/staking/value-object/otp-type");

module.exports = {
  getMe: async (req, res, next) => {
    try {
      let result = await User.findOne({
        where: {
          id: req.user.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      return res.ok(userMapper(result));
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      let result = await User.findOne({
        where: {
          id: req.user.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      const match = await bcrypt.compare(req.body.password, user.password_hash);
      if (!match) {
        return res.badRequest(res.__("PASSWORD_INVALID", "PASSWORD_INVALID"));
      }

      let passWord = bcrypt.hashSync(req.body.new_password, 10);
      let [_, user] = await StakingPlatform.update({
        password_hash: passWord
      }, {
          where: {
            id: req.user.id
          },
          returning: true
        });

      if (!user || user.length == 0) {
        return res.serverInternalError();
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error('changePassword fail:', err);
      next(err);
    }
  },
  get2Fa: async (req, res, next) => {
    try {
      const secret = speakeasy.generateSecret();
      console.log(secret);
      return res.ok(secret.base32);
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  update2Fa: async (req, res, next) => {
    try {
      var verified = speakeasy.totp.verify({
        secret: req.body.twofa_secret,
        encoding: 'base32',
        token: req.body.twofa_code,
      });

      if (!verified) {
        return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT");
      }

      let [_, response] = await User.update({
        twofa_secret: req.body.twofa_secret,
        twofa_enable_flg: true
      }, {
          where: {
            id: req.user.id
          },
          returning: true
        });
      if (!response || response.length == 0) {
        return res.serverInternalError();
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  }
}