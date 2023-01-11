const {required} = require("../../../../common/validation/validators/required.js");
const {isString} = require("../../../../common/validation/validators/is-string.js");
const {optional} = require("../../../../common/validation/validators/optional.js");

const UpdateFolderSchema = {
    parentId: [optional, required()],
    name: [optional, required(), isString]
}

module.exports = { UpdateFolderSchema }