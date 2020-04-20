const objectMapper = require('object-mapper');

const destObject = {
  single: {
    id: 'id',
    name: 'name',
    api_key: 'api_key',
    secret_key: 'secret_key',
    actived_flg: 'actived_flg',
    status: 'status'
  },
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].api_key': '[].api_key',
    '[].secret_key': '[].secret_key',
    '[].actived_flg': '[].actived_flg',
    '[].status': '[].status'
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 