const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const userMapper = require("app/feature/response-schema/user.response-schema");
const speakeasy = require("speakeasy");
const OTP = require("app/model/staking").otps;
const OtpType = require("app/model/staking/value-object/otp-type");

module.exports = async (req, res, next) => {
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: OtpType.TWOFA
      }
    });
    if (!otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }

    var verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: req.body.twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_code"] });
    }

    let user = await User.findOne({
      where: {
        id: otp.user_id
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    if (user.status == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (user.status == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      })

    req.session.authenticated = true;
    req.session.user = user;
    return res.ok(userMapper(user));
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
