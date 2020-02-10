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
const UserActivityLog = require("app/model/staking").user_activity_logs;
const ActionType = require("app/model/staking/value-object/user-activity-action-type");

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
            id: req.user.id,
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

      let result = await User.findOne({
        where: {
          twofa_secret: req.body.twofa_secret
        }
      })

      if (result) {
        return res.badRequest(res.__("TWOFA_EXISTS_ALREADY"), "TWOFA_EXISTS_ALREADY");
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
  },
  loginHistory: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;

      const { count: total, rows: items } = await UserActivityLog.findAndCountAll({
        limit,
        offset,
        where: {
          user_id: req.user.id,
          action: ActionType.LOGIN
        },
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('loginHistory fail:', err);
      next(err);
    }
  }
}