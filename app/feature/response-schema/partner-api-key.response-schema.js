const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  name: 'name',
  api_key: 'api_key',
  secret_key: 'secret_key',
  actived_flg: 'actived_flg'
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};
