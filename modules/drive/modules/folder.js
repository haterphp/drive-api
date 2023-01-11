const {FolderController} = require("../controllers/folder.js");
const {FolderRepository} = require("../repository/folder.js");
const {register} = require("../../../common/routing.js");

const {validate} = require("../../../common/validation/index.js");
const {CreateFolderSchema} = require("../schema/folder/create.js");
const {UpdateFolderSchema} = require("../schema/folder/update.js");
const FolderModule = (options) => {
    const { authGuard, db, router } = options

    const repository = new FolderRepository(db)
    const controller = new FolderController(repository)

    router.get('/folder/:id', authGuard, register(controller.view.bind(controller)))
    router.post('/folder', authGuard, validate(CreateFolderSchema), register(controller.create.bind(controller)))
    router.patch('/folder/:id', authGuard, validate(UpdateFolderSchema), register(controller.update.bind(controller)))
    router.delete('/folder/:id', authGuard, register(controller.delete.bind(controller)))
}

module.exports = FolderModule