const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].cycle': '[].cycle',
    '[].cycle_type': '[].cycle_type',
    '[].min_amount': '[].min_amount',
    '[].amount_unit': '[].amount_unit',
    '[].createdAt': '[].created_at',
    '[].created_by': '[].created_by'
  },
  single: {
    id: 'id',
    platform: 'platform',
    cycle: 'cycle',
    cycle_type: 'cycle_type',
    min_amount: 'min_amount',
    amount_unit: 'amount_unit',
    createdAt: 'created_at',
    created_by: 'created_by'
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