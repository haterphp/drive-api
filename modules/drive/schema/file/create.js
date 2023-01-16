const {required} = require("../../../../common/validation/validators/required.js");

const CreateFileSchema = {
    folderId: [required()],
    file: [required()]
}

module.exports = { CreateFileSchema }