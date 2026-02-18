const validator = require("validator");

const validate = (params) => {
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let email = !validator.isEmpty(params.email) && validator.isEmail(params.email) && validator.isEmail(params.email);
    let password = !validator.isEmpty(params.password);

    if (name && email && password) {
        return true;
    } else {
        return false;
    }
}

module.exports = validate;