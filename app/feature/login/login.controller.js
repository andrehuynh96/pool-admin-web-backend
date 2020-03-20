const Sequelize = require('sequelize');
const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserActivityLog = require("app/model/staking").user_activity_logs;
const OTP = require("app/model/staking").otps;
const UserStatus = require("app/model/staking/value-object/user-status");
const ActionType = require("app/model/staking/value-object/user-activity-action-type");
const OtpType = require("app/model/staking/value-object/otp-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
const UserRole = require('app/model/staking').user_roles;

module.exports = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }

    if (user.user_sts == UserStatus.LOCKED) {
      let nextAcceptableLogin = new Date(user.updatedAt);
      nextAcceptableLogin.setSeconds(nextAcceptableLogin.getSeconds() + parseInt(config.lockUser.lockTime));
      let rightNow = new Date();
      if (nextAcceptableLogin >= rightNow) // don't forbid if lock time has passed
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    if (user.user_sts == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    const match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!match) {
      await User.update({
        attempt_login_number: user.attempt_login_number + 1, // increase attempt_login_number in case wrong password
        user_sts: user.attempt_login_number + 1 >= config.lockUser.maximumTriesLogin ? UserStatus.LOCKED : user.user_sts // lock user if attempt_login_number reach the allowed maximum tries
      }, {
        where: {
          id: user.id
        }
      })
      return res.unauthorized(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
    }
    else 
      await User.update({
        attempt_login_number: 0, 
        user_sts: user.user_sts == UserStatus.LOCKED ? UserStatus.ACTIVATED : user.user_sts, // unlock user if login credentials is valid (after lock time already)
        latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
      }, {
        where: {
          id: user.id
        }
      })

    if (user.twofa_enable_flg) {
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);

      await OTP.update({
        expired: true
      }, {
          where: {
            user_id: user.id,
            action_type: OtpType.TWOFA
          },
          returning: true
        })

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.TWOFA
      })

      return res.ok({
        twofa: true,
        verify_token: verifyToken
      });
    }
    else {
      const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
      let roles = await UserRole.findAll({
        attributes: ['role_id'],
        where: {
          user_id: user.id
        }
      })

      await UserActivityLog.create({
        user_id: user.id,
        client_ip: registerIp,
        action: ActionType.LOGIN,
        user_agent: req.headers['user-agent']
      });
      req.session.authenticated = true;
      req.session.user = user;
      let roleList = roles.map(role => role.role_id);
      req.session.role = roleList;
      let response = userMapper(user); 
      response.role = roleList;
      return res.ok({
        twofa: false,
        user: response
      });
    }
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
