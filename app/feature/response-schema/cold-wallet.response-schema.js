const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].min_amount': '[].min_amount',
    '[].amount_unit': '[].amount_unit',
    '[].reward_address': '[].reward_address',
    '[].percentage': '[].percentage',
    '[].enable_flg': '[].enable_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
    '[].created_by': '[].created_by',
    '[].updated_by': '[].updated_by'
  },
  single: {
    id: 'id',
    platform: 'platform',
    min_amount: 'min_amount',
    amount_unit: 'amount_unit',
    reward_address: 'reward_address',
    percentage: 'percentage',
    enable_flg: 'enable_flg',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    created_by: 'created_by',
    updated_by: 'updated_by'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);

  }
}; 