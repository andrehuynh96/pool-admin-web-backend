const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  email: 'email',
  twofa_secret: 'twofa_secret',
  twofa_enable_flg: 'twofa_enable_flg'
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};

