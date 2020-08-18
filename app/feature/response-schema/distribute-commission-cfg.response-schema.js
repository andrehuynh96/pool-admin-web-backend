const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].cycle': '[].cycle',
    '[].cycle_type': '[].cycle_type',
    '[].min_amount': '[].min_amount',
    '[].amount_unit': '[].amount_unit',
    '[].min_amount_withdrawal': '[].min_amount_withdrawal',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
    '[].created_by': '[].created_by',
    '[].updated_by': '[].updated_by'
  },
  single: {
    id: 'id',
    platform: 'platform',
    cycle: 'cycle',
    cycle_type: 'cycle_type',
    min_amount: 'min_amount',
    amount_unit: 'amount_unit',
    min_amount_withdrawal: 'min_amount_withdrawal',
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