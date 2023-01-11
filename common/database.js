const mongoose = require("mongoose");
const createDatabaseConnection = async (connectionString, MODELS = []) => {
    const connection = await mongoose.connect(connectionString)
    const models = MODELS.map((fn) => fn(connection)).reduce((prev, obj) => ({ ...prev, [obj.name]: obj.model }), {})

    return { connection, models }
}

module.exports = { createDatabaseConnection }