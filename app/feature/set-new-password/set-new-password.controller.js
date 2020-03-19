const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const OTP = require("app/model/staking").otps;
const OtpType = require("app/model/staking/value-object/otp-type");
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { passwordEvaluator } = require('app/lib/utils');
const Op = Sequelize.Op;

module.exports = async (req, res, next) => {
  try {
    if (!passwordEvaluator(req.body.password)) {
      return res.badRequest(res.__("WEAK_PASSWORD"), "WEAK_PASSWORD");
    }

    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: { [Op.in]: [OtpType.FORGOT_PASSWORD, OtpType.CREATE_ACCOUNT] }
      }
    });
    if (!otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }

    let user = await User.findOne({
      where: {
        id: otp.user_id
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }
    
    if (user.user_sts == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    let passWord = bcrypt.hashSync(req.body.password, 10);

    let data = { password_hash: passWord };

    if (user.user_sts == UserStatus.UNACTIVATED) {
      data.user_sts = UserStatus.ACTIVATED;
    } 
    let [_, response] = await User.update(data, {
        where: {
          id: user.id,
          attempt_login_number: 0 // reset attempt login number after password resetting
        },
        returning: true
      });
    if (!response || response.length == 0) {
      return res.serverInternalError();
    }

    return res.ok(true);
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
}; 
