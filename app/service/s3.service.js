const logger = require('app/lib/logger');
const config = require('app/config');
const {s3} = require('app/lib/cdn');

module.exports = {
  put: async (key, body, next) => {
    try {
      let params = {
        Bucket: config.aws.bucket,
        Key: key,
        Body: body,
        ACL: 'public-read',
        ServerSideEncryption: "AES256",
        StorageClass: "STANDARD_IA"
      }
      let putObject = await s3.putObject(params).promise();
      return putObject;
    } catch (ex) {
      logger.error(ex);
      next(ex);
    }
  },
  get: async (key, next) => {
    try {
      let params = {
        Bucket: config.aws.bucket, 
        Key: key
      }
      let getObject = await s3.getObject(params).promise();
      return getObject;
    } catch (ex) {
      logger.error(err);
      next(err);
    }
  }
}