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

    async throwIfNotMyFolder(folderId, userId) {
        try {
            const parentFolder = await this.getFolderById(folderId, true)
            if(parentFolder.userId !== userId) throw AppException.new({
                code: StatusCode.FORBIDDEN,
                message: "У вас нет доступа"
            })
            return parentFolder
        }  catch (e) {
            throw e
        }
    }


    async getRootFolder(userId) {
        try {
            return await this.folderModel.findOne({userId}, { sort: { 'created_at': -1 } })
        } catch (e) {
            throw AppException.new({
                code: StatusCode.NOT_FOUND,
                message: 'Папка не найдена'
            })
        }
    }

    async getFolderById(id, needUserId = false) {
        try {
            const folder = await this.folderModel.findById(id)
            return FolderPipe(folder, needUserId)
        } catch (e) {
            throw AppException.new({
                code: StatusCode.NOT_FOUND,
                message: 'Папка не найдена'
            })
        }
    }

    async getFolderByIdWithChildren(id, req) {
        try {
            const folder = await this.throwIfNotMyFolder(id, req.user.id)
            const folderChildren = await this.folderModel.find({ parentId: folder.id })
            const folderFiles = await this.#getFolderFilesById(folder.id)

            return {
                ...FolderPipe(folder),
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

    async createNewFolder(parentId, name, userId) {
        try {
            await this.throwIfNotMyFolder(parentId, userId)
            const folder = await this.folderModel.create({ parentId, name, userId })
            return FolderPipe(folder)
        } catch (e) {
            throw AppException.new({
                code: e.code ?? StatusCode.SERVER_ERROR,
                message: e.message
            })
        }
    }

    async updateFolder(id, parentId, name, userId) {
        try {
            const folder = await this.throwIfNotMyFolder(parentId, userId)
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

    async removeFolder(id, userId) {
        try {
            const folder = await this.throwIfNotMyFolder(id, userId)
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