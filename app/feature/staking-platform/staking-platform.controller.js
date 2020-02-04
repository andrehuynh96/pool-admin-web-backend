const logger = require('app/lib/logger');
const StakingPlatform = require("app/model/staking").staking_platforms;
const TimeUnit = require("app/model/staking/value-object/time-unit");
const Minio = require("app/lib/cdn/minio");
const path = require("path");
const config = require('app/config');

module.exports = {

  timeUnit: (req, res, next) => {
    try {
      let result = Object.values(TimeUnit);
      return res.ok(result);
    }
    catch (err) {
      logger.error('get timeUnit fail:', err);
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = { deleted_flg: false };
      if (req.query.staking_type) {
        where.staking_type = req.query.staking_type
      }
      if (req.query.status != undefined) {
        where.status = req.query.status
      }

      const { count: total, rows: items } = await StakingPlatform.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('getAll staking platform fail:', err);
      next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      let result = await StakingPlatform.findOne({
        where: {
          deleted_flg: false,
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("NOT_FOUND"), "NOT_FOUND");
      }

      return res.ok(result);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      let result = await StakingPlatform.findOne({
        where: {
          deleted_flg: false,
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("NOT_FOUND"), "NOT_FOUND");
      }

      if (req.body.icon) {
        let file = path.parse(req.body.icon.file.name);
        if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
          return res.badRequest(res.__("UNSUPPORT_FILE_EXTENSION"), "UNSUPPORT_FILE_EXTENSION", { fields: ["icon"] });
        }

        req.body.icon = await _uploadFile(req, res);
      }

      if (req.user) {
        req.body.updated_by = req.user.id;
      }

      let [_, response] = await StakingPlatform.update({
        ...req.body
      }, {
          where: {
            id: result.id
          },
          returning: true
        })

      return res.ok(response[0]);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      if (req.body.icon) {
        let file = path.parse(req.body.icon.file.name);
        if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
          return res.badRequest(res.__("UNSUPPORT_FILE_EXTENSION"), "UNSUPPORT_FILE_EXTENSION", { fields: ["icon"] });
        }
        req.body.icon = await _uploadFile(req, res);
      }
      if (req.user) {
        req.body.created_by = req.user.id;
        req.body.updated_by = req.user.id;
      }
      let response = await StakingPlatform.create({
        ...req.body
      });

      return res.ok(response);
    }
    catch (err) {
      logger.error('get staking platform fail:', err);
      next(err);
    }
  }
}


async function _uploadFile(req, res) {
  return new Promise((resolve, reject) => {
    let file = path.parse(req.body.icon.file.name);
    if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
      reject("unsupport file ext");
    }
    let uploadName = `${config.CDN.folderPlatform}/${file.name}-${Date.now()}${file.ext}`;
    Minio.putObject(config.CDN.bucket, uploadName, req.body.icon.data, function (error, etag) {
      if (error) {
        logger.error("Minio::upload file fail", error);
        reject("upload file fail");
      }
      resolve(`${config.CDN.url}/${config.CDN.bucket}/${uploadName}`);
    });
  })
}
