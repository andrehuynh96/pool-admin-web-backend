module.exports = {
    passwordEvaluator: (p) => {
        let score = 0;
        if (p.length < 10) return false;
        if (/[a-z]/.test(p)) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[ !"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/.test(p)) score++;
        return score >= 2;
    }
}