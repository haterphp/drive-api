const mongoose = require("mongoose");

const schema = mongoose.Schema({
    parentId: { type: String, default: null },
    name: String,
})

const registerSchema = (connection) => {
    const model = connection.model('folders', schema)
    return { name: 'Folder', model }
}

module.exports = registerSchema