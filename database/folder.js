const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentId: { type: String, default: null },
    name: String,
})

const registerSchema = (connection) => {
    const model = connection.model('folders', schema)
    return { name: 'Folder', model }
}

module.exports = registerSchema