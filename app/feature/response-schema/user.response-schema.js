const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  email: 'email'
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};
