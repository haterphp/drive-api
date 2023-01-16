const {AuthGuard} = require("../auth/guards/index.js");
const {Router} = require("express");

const {FolderModule} = require('./modules/folder.js')
const {FileModule} = require("./modules/file.js");

const prefix = '/drive'
const DriveModule = (app) => {
    const authGuard = AuthGuard(app.db)
    const router = Router()
    const MODULES = [FolderModule, FileModule]

    MODULES.forEach((module) => {
        module({ authGuard, db: app.db, router })
    })

    return { router, prefix }
}

module.exports = DriveModule