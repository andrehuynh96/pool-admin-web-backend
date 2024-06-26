const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const userMapper = require("app/feature/response-schema/user.response-schema");
const speakeasy = require("speakeasy");
const OTP = require("app/model/staking").otps;
const OtpType = require("app/model/staking/value-object/otp-type");
const UserActivityLog = require("app/model/staking").user_activity_logs;
const ActionType = require("app/model/staking/value-object/user-activity-action-type");
const UserRole = require('app/model/staking').user_roles;
const RolePermissions = require('app/model/staking').role_permissions
const Permissions = require('app/model/staking').permissions
const Roles = require('app/model/staking').roles

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

    let user = await User.findOne({
      where: {
        id: otp.user_id
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    if (user.user_sts == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (user.user_sts == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    var verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: req.body.twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_code"] });
    }

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });

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
      let rolePermissions = await RolePermissions.findAll({
        attributes: [
          "permission_id"
        ],
        where: {
          role_id: roleList
        }
      });
      rolePermissions = [...new Set(rolePermissions.map(ele => ele.permission_id))];
      let permissions = await Permissions.findAll({
        attributes: [
          "name"
        ],
        where: {
          id: rolePermissions
        }
      });
      req.session.permissions = permissions.map(ele => ele.name);
      roleList = await Roles.findAll({
        attributes: [
          "id", "name", "level", "root_flg"
        ],
        where: {
          id: roleList
        }
      })

      let response = userMapper(user);
      response.roles = roleList;
      req.session.roles = roleList;
      return res.ok({
        user: response
      });
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
