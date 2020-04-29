const User = require('app/model/staking').users;

module.exports = {
  passwordEvaluator: (p) => {
    let score = 0;
    if (p.length < 10) return false;
    if (/[a-z]/.test(p)) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[ !"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/.test(p)) score++;
    return score >= 2;
  },
  secondDurationTime: (number, type) => {
    let SECOND_TYPE_HOUR = number * 60 * 60
    switch (type) {
      case 'MINUTE': return number * 60;
        break;
      case 'HOUR': return SECOND_TYPE_HOUR;
        break;
      case 'DAY': return SECOND_TYPE_HOUR * 24;
        break;
      case 'WEEK': return SECOND_TYPE_HOUR * 7 * 24;
        break;
      case 'MONTH': return SECOND_TYPE_HOUR * 30 * 24;
        break;
      case 'YEAR': return SECOND_TYPE_HOUR * 365 * 24;
        break;
    }
  },
  _getUsername: async (arr) => {
    if (!arr || arr.length == 0) {
      return arr;
    }
    let userNames = await User.findAll({
      attributes: [
        "id", "name"
      ],
      where: {
        id: arr.map(ele => ele.updated_by)
      }
    });
    let names = userNames.reduce((result, item) => {
      result[item.id] = item.name;
      return result;
    }, {});


    for (let ele of arr) {
      ele.updated_by_user_name = ele.partner_updated_by ? 'Childpool' : names[ele.updated_by]
    }

    return arr;
  }
}