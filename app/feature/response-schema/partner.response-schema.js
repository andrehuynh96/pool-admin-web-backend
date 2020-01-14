const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  name: 'name',
  email: 'email',
  parent_id: 'parent_id',
  partner_type: 'partner_type',
  created_at: 'created_at'
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};
