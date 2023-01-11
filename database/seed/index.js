require('dotenv').config()

const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_CONNECTION_STRING + "/" + process.env.MONGODB_CONNECTION_DATABASE

const FolderModel = require('../folder.js')
const FolderSeeder = require('./folder/index.js')

async function defineSeeders(seeders, models) {
    for (const s of seeders) {
        await s(models)
    }
}

async function defineModels(models, connection) {
    return models.map((fn) => fn(connection)).reduce((prev, obj) => ({ ...prev, [obj.name]: obj.model }), {})
}

async function seed() {
    try {
        const connection = await mongoose.connect(connectionString)
        const models = await defineModels([ FolderModel ], connection)
        await defineSeeders([ FolderSeeder ], models)
        console.log('Migration success')
    } catch (e) {
        console.error(e)
    }

}

void seed()