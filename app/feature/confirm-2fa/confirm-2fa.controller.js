const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const VerifyTokenType = require("app/model/staking/value-object/verify-token-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const speakeasy = require("speakeasy");

module.exports = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        verify_token: req.body.verify_token,
        verify_token_type: VerifyTokenType.TWOFA,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    var verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: req.body.twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT");
    }

    if (user.status == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (user.status == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }
    let today = new Date();
    if (user.verify_token_expired_at < today) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }
    req.session.authenticated = true;
    req.session.user = user;
    return res.ok(userMapper(user));
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
