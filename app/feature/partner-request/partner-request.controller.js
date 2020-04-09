const logger = require('app/lib/logger');
const PartnerRequest = require('app/model/staking').partner_request_change_reward_addresses;
const Partner = require('app/model/staking').partners;
const PartnerCommission = require('app/model/staking').partner_commissions;
const uuidV4 = require('uuid/v4');
const config = require('app/config');
const mailer = require('app/lib/mailer');

module.exports = async (req, res, next) => {
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
        _sendEmail(partner, commission, partnerRequest,verifyToken);
        return res.ok(true);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function _sendEmail(partner, commission, partnerRequest, verifyToken) {
    try {
      let subject = ` ${config.emailTemplate.partnerName} - Change reward address`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.website.urlConfirmingRequest}${verifyToken}`,
        partnerName: partner.name,
        platform: commission.platform,
        rewardAddress: partnerRequest.reward_address,

      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, partnerRequest.email_confirmed, data, config.emailTemplate.confirmingRequest);
    } catch (err) {
      logger.error("send confirmed email for changing reward address fail", err);
    }
  }

