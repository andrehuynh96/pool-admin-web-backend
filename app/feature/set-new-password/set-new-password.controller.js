const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const VerifyTokenType = require("app/model/staking/value-object/verify-token-type");
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        verify_token: req.body.verify_token,
        verify_token_type: VerifyTokenType.FORGOT_PASSWORD,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID");
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

    let passWord = bcrypt.hashSync(req.body.password, 10);
    user = await User.update({
      password_hash: passWord,
    }, {
        where: {
          id: user.id
        },
        returning: true
      })

    return res.ok(true);
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
