const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].partner_id': '[].partner_id',
    '[].partner_commission_id': '[].partner_commission_id',
    '[].reward_address': '[].reward_address',
    '[].partner_commission.platform': '[].platform',
    '[].status': '[].status',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',

  },
  single: {
    id: 'id',
    partner_id: 'partner_id',
    partner_commission_id: 'partner_commission_id',
    reward_address: 'reward_address',
    'partner_commission.platform': 'platform',
    status: 'status',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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