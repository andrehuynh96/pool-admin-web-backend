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
  }
}