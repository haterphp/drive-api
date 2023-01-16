const {StatusCode} = require("../../../enums/status-code.js");

class FileController {

    constructor(repository) {
        this._repository = repository
    }

    async create (req, res) {
        const {body, files} = req
        const file = await this._repository.create(files.file, body.folderId, req)
        res.status(StatusCode.CREATED).json(file)
    }

    async remove (req, res) {
        const {id} = req.params
        await this._repository.remove(id)
        res.status(StatusCode.OK).json({ message: "Файл успешно удален" })
    }

}

module.exports = { FileController }