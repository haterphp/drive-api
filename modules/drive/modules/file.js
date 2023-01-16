const {FileController} = require("../controllers/file.js");
const {FileRepository} = require("../repository/file.js");
const {register} = require("../../../common/routing.js");

const {validate} = require("../../../common/validation/index.js");
const {CreateFileSchema} = require("../schema/file/create.js");
const FileModule = (options) => {
    const { authGuard, db, router } = options

    const repository = new FileRepository(db)
    const controller = new FileController(repository)

    router.post('/files', authGuard, validate(CreateFileSchema), register(controller.create.bind(controller)))
    router.delete('/files/:id', authGuard, register(controller.remove.bind(controller)))
}

module.exports = { FileModule }