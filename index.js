require('dotenv').config()

const express = require('express')
const server = express()

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

const {registerModules} = require("./modules/index.js");
const {createDatabaseConnection} = require("./common/database.js");

const UserModel = require('./database/user.js')
const FolderModel = require('./database/folder.js')
const {ExceptionHandler} = require("./common/exception/handler-middleware.js");

const PORT = process.env.PORT ?? 3000

void async function () {
    const db = await createDatabaseConnection(
        process.env.MONGODB_CONNECTION_STRING + '/' + process.env.MONGODB_CONNECTION_DATABASE,
        [ UserModel, FolderModel ]
    )
    registerModules(server, { db })
    ExceptionHandler(server)

    server.listen(PORT, () => {
        console.log('Server start on port %d', PORT)
    })
}()
