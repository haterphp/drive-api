const {required} = require("../../../common/validation/validators/required.js");
const {isString} = require("../../../common/validation/validators/is-string.js");

const CreateUserSchema = {
    login: [required(), isString],
    password: [required(), isString],
}

module.exports = {CreateUserSchema}