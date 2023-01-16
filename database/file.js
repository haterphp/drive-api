const mongoose = require("mongoose");

const schema = mongoose.Schema({
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    name: String,
    filepath: String,
})

const registerSchema = (connection) => {
    const model = connection.model('files', schema)
    return { name: 'File', model }
}

module.exports = registerSchema