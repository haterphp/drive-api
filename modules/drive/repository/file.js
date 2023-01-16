const {FolderRepository} = require("./folder.js");
const {AppException} = require("../../../common/exception/index.js");
const {StatusCode} = require("../../../enums/status-code.js");
const {FilePipe} = require("../pipe/file.js");

class FileRepository {
    constructor(db) {
        this.model = db.models.File
        this.folderRepository = new FolderRepository(db)
    }

    async #findFileById(id) {
        try {
            const file = await this.model.findById(id)
            if (!file) throw new Error('')
            return file
        } catch (e) {
            throw AppException.new(
                { code: StatusCode.NOT_FOUND, message: "Файл не найден" }
            )
        }
    }
    
    async #updateFile(file) {
        try {
            const filepath = 'uploads/' + file.name
            await file.mv('./' + filepath)
            return {
                name: file.name,
                filepath
            }
        } catch (e) {
            throw AppException.new({
                code: StatusCode.SERVER_ERROR,
                message: "Ошибка загрузки файла"
            })
        }
    }
    async create(file, folderId, req) {
        try {
            await this.folderRepository.getFolderById(folderId)
            const fileInfo = await this.#updateFile(file)
            const response = await this.model.create({
                folderId,
                ...fileInfo
            })
            return FilePipe(response, req)
        } catch (e) {
            console.log(e)
            if (e instanceof AppException) throw e
            throw AppException.new({
                code: StatusCode.BAD_REQUEST,
                message: "Ошибка создания"
            })
        }
    }
    
    async remove(id) {
        try {
            const file = await this.#findFileById(id)
            await file.remove()
        } catch (e) {
            if (e instanceof AppException) throw e
            throw AppException.new({
                code: StatusCode.BAD_REQUEST,
                message: "Ошибка удаления"
            })
        }
    }
}

module.exports = { FileRepository }