const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const VerifyTokenType = require("app/model/staking/value-object/verify-token-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");

module.exports = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }
    const match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!match) {
      return res.unauthorized(res.__("LOGIN_FAIL", "LOGIN_FAIL"));
    }

    if (user.status == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (user.status == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }

    if (user.twofa_enable_flg) {
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await User.update({
        verify_token: verifyToken,
        verify_token_expired_at: today,
        verify_token_type: VerifyTokenType.TWOFA
      }, {
          where: {
            id: user.id
          }
        })
      return res.ok({
        twofa: true,
        verify_token: verifyToken
      });

    }
    else {
      req.session.authenticated = true;
      req.session.user = user;
      return res.ok({
        twofa: false,
        user: userMapper(user)
      });
    }
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
