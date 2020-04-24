const logger = require('app/lib/logger');
const PartnerRequest = require('app/model/staking').partner_request_change_reward_addresses;
const Partner = require('app/model/staking').partners;
const PartnerCommission = require('app/model/staking').partner_commissions;
const StakingPlatform = require('app/model/staking').staking_platforms;
const uuidV4 = require('uuid/v4');
const config = require('app/config');
const mailer = require('app/lib/mailer');
const mapper = require('app/feature/response-schema/partner-request.response-schema');
const Status = require('app/model/staking/value-object/request-change-reward-address-status');
const { Op } = require("sequelize");

module.exports = {
    update: async (req, res, next) => {
        try {
            let {params: {partner_id, commission_id, id}, body: {status}} = req;
            let verifyToken = Buffer.from(uuidV4()).toString('base64');
            let partner = await Partner.findOne({
                where: {
                    id: partner_id
                }
            });
            if (!partner) {
                return res.badRequest(res.__("PARTNER_NOT_FOUND"), "PARTNER_NOT_FOUND");
            }
            let commission = await PartnerCommission.findOne({
                where: {
                    id: commission_id,
                    partner_id: partner_id
                }
            });
    
            if (!commission) {
                return res.badRequest(res.__("PARTNER_COMMISSION_NOT_FOUND"), "PARTNER_COMMISSION_NOT_FOUND");
            }
            let partnerRequest = await PartnerRequest.findOne({
                where: {
                    partner_id: partner_id,
                    partner_commission_id: commission_id,
                    id: id,
                    status: 1
                }
            });
            if (!partnerRequest) {
                return res.badRequest(res.__("CHANGE_REQUEST_ADDRESS_NOT_FOUND"), "CHANGE_REQUEST_ADDRESS_NOT_FOUND");
            }
            let stakingPlatform = await StakingPlatform.findOne({
                where: {
                    platform: commission.platform
                }
            })
            let icon = stakingPlatform ? stakingPlatform.icon : null;
            await PartnerRequest.update({
                status: status,
                verify_token: verifyToken
              }, {
                  where: {
                    partner_id: partner_id,
                    partner_commission_id: commission_id,
                    id: id
                  },
                });
            
            _sendEmail(partner, commission, partnerRequest,verifyToken, icon);
            return res.ok(true);
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
    getAll: async (req, res, next) => {
        try {
            const { params: {partner_id}, query: { offset, limit } } = req;
            const off = parseInt(offset) || 0;
            const lim = parseInt(limit) || parseInt(config.appLimit);
            let include = [
                {
                  model: PartnerCommission
                }
              ];
            const where = {
                partner_id: partner_id,
                status: {
                    [Op.ne]: Status.DRAFT
                }
            }
            const { count: total, rows: items } = await PartnerRequest.findAndCountAll({ offset: off, limit: lim, where: where, include: include, order: [['updated_at', 'DESC']] });
            return res.ok({
                items: mapper(items),
                offset: off,
                limit: lim,
                total: total
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const { params: {partner_id, partner_commission_id, id}} = req;
            const result = await PartnerRequest.findOne({
                where: {
                    partner_id: partner_id,
                    partner_commission_id: partner_commission_id,
                    id: id
                },
                include: [{
                    model: PartnerCommission
                }]
            })
            if (!result) {
                return res.badRequest(res.__("PARTNER_REQUEST_CHANGE_REWARD_ADDRESS_NOT_FOUND"), "PARTNER_REQUEST_CHANGE_REWARD_ADDRESS_NOT_FOUND");
              }
        
            return res.ok(mapper(result));
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
}

async function _sendEmail(partner, commission, partnerRequest, verifyToken, icon) {
    try {
      let subject = ` ${config.emailTemplate.partnerName} - Change reward address`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: partnerRequest.link + `/${config.emailTemplate.partnerName.toLowerCase()}`,
        link: `${partnerRequest.link}${config.website.urlApproveRequest}${verifyToken}`,
        partnerName: partner.name,
        platform: commission.platform,
        rewardAddress: partnerRequest.reward_address,
        icon: icon
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, partnerRequest.email_confirmed, data, config.emailTemplate.confirmingRequest);
    } catch (err) {
      logger.error("send confirmed email for changing reward address fail", err);
    }
}

