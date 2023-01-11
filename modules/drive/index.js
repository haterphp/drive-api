const {AuthGuard} = require("../auth/guards/index.js");
const {Router} = require("express");

const FolderModule = require('./modules/folder.js')

const prefix = '/drive'
const DriveModule = (app) => {
    const authGuard = AuthGuard(app.db)
    const router = Router()
    const MODULES = [FolderModule]

    MODULES.forEach((module) => {
        module({ authGuard, db: app.db, router })
    })

    return { router, prefix }
}

module.exports = DriveModule