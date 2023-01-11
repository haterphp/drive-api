const {required} = require("../../../../common/validation/validators/required.js");
const {isString} = require("../../../../common/validation/validators/is-string.js");

const CreateFolderSchema = {
    parentId: [required()],
    name: [required(), isString]
}

module.exports = { CreateFolderSchema }