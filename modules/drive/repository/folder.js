const {AppException} = require("../../../common/exception/index.js");
const {StatusCode} = require("../../../enums/status-code.js");
const {FolderPipe} = require("../pipe/folder.js");
const {FilePipe} = require("../pipe/file.js");

class FolderRepository {
    constructor(db) {
        this.folderModel = db.models.Folder
        this.fileModel = db.models.File
    }

    async throwIfFolderNotFoundOrIsRoot(folder, message = 'Ошибка взаимодействия') {
        const rootFolder = await this.getRootFolder()

        if (folder.id === rootFolder.id) {
            throw AppException.new(
                { code: StatusCode.BAD_REQUEST, message }
            )
        }
    }

    async getRootFolder() {
        try {
            return await this.folderModel.findOne({}, { sort: { 'created_at': -1 } })
        } catch (e) {
            throw AppException.new({
                code: StatusCode.NOT_FOUND,
                message: 'Папка не найдена'
            })
        }
    }

    async getFolderById(id) {
        try {
            const folder = await this.folderModel.findById(id)
            return FolderPipe(folder)
        } catch (e) {
            throw AppException.new({
                code: StatusCode.NOT_FOUND,
                message: 'Папка не найдена'
            })
        }
    }

    async getFolderByIdWithChildren(id, req) {
        try {
            const folder = await this.getFolderById(id)
            const folderChildren = await this.folderModel.find({ parentId: folder.id })
            const folderFiles = await this.#getFolderFilesById(folder.id)

            return {
                ...folder,
                children: [
                    ...folderChildren.map((folder) => this.#pipeEntityType('folder', folder)),
                    ...folderFiles.map((file) => this.#pipeEntityType('file', file, req))
                ]
            }
        } catch (e) {
            console.log(e)
            if(e instanceof AppException) throw e
            throw AppException.new({
                code: StatusCode.NOT_FOUND,
                message: 'Ошибка при поиски зависимостей'
            })
        }
    }

    #pipeEntityType(type, value, req) {
        const PIPES = {
            'folder': FolderPipe,
            'file': FilePipe,
        }

        const fn = PIPES[type]
        return {
            ...fn(value, req),
            type
        }
    }

    async #getFolderFilesById(id) {
        return await this.fileModel.find({ folderId: id })
    }

    async createNewFolder(parentId, name) {
        try {
            await this.getFolderById(parentId)
            const folder = await this.folderModel.create({ parentId, name })
            return FolderPipe(folder)
        } catch (e) {
            throw AppException.new({
                code: e.code ?? StatusCode.SERVER_ERROR,
                message: e.message
            })
        }
    }

    async updateFolder(id, parentId, name) {
        try {
            const folder = await this.getFolderById(id)
            await this.throwIfFolderNotFoundOrIsRoot(folder, 'Папка запрещена для редактирования')
            const body = {}

            if (parentId) {
                await this.getFolderById(parentId)
                body.parentId = parentId
            }

            if (name) body.name = name

            await this.folderModel.updateOne({_id: folder.id}, body)
            return FolderPipe({ ...folder, ...body })
        } catch (e) {
            throw AppException.new({
                code: e.code ?? StatusCode.SERVER_ERROR,
                message: e.message
            })
        }
    }

    async removeFolder(id) {
        try {
            const folder = await this.getFolderById(id)
            await this.throwIfFolderNotFoundOrIsRoot(folder, 'Папка запрещена для удаления')
            const ids = [
                id,
                ...(await this.folderModel.find({ parentId: id })).map(item => item.id)
            ]
            for (const folderId of ids) {
                await this.folderModel.remove({ _id: folderId })
            }
        } catch (e) {
            throw AppException.new({
                code: e.code ?? StatusCode.SERVER_ERROR,
                message: e.message
            })
        }
    }
}

module.exports = {FolderRepository}