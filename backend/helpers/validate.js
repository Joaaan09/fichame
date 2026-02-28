const validator = require("validator");

const validate = (params) => {
    // Allow letters (with accents), spaces, and hyphens in names
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: 100 }) &&
        /^[a-záéíóúñü\s\-']{3,}$/i.test(params.name);

    let email = !validator.isEmpty(params.email) && validator.isEmail(params.email) && validator.isEmail(params.email);
    let password = !validator.isEmpty(params.password);

    if (name && email && password) {
        return true;
    } else {
        return false;
    }
}

module.exports = validate;