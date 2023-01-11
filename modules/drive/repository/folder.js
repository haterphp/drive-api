const {AppException} = require("../../../common/exception/index.js");
const {StatusCode} = require("../../../enums/status-code.js");

class FolderRepository {
    constructor(db) {
        this.folderModel = db.models.Folder
    }

    #toFormat(folder) {
        return {
            id: folder.id,
            name: folder.name
        }
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
            const folderChildren = await this.folderModel.find({ parentId: folder.id })
            return {
                ...this.#toFormat(folder),
                children: folderChildren.map((folder) => this.#toFormat(folder))
            }
        } catch (e) {
            throw AppException.new({
                code: StatusCode.NOT_FOUND,
                message: 'Папка не найдена'
            })
        }
    }

    async createNewFolder(parentId, name) {
        try {
            await this.getFolderById(parentId)
            const folder = await this.folderModel.create({ parentId, name })
            return this.#toFormat(folder)
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
            return this.#toFormat({ ...folder, ...body })
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