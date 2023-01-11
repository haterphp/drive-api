const AuthModel = require('./auth/index.js')
const DriveModule = require('./drive/index.js')

const MODULES = [AuthModel, DriveModule]

const registerModules = (server, app)  => {
    MODULES.forEach((module) => {
        const { router, prefix } = module(app)
        server.use(prefix, router)
    })
}

module.exports = { registerModules }