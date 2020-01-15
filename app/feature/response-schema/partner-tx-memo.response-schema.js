const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  platform: 'platform',
  memo: 'memo',
  default_flg: 'default_flg',
  updatedAt: 'updated_at'
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};
