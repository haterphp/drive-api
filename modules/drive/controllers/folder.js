const {StatusCode} = require("../../../enums/status-code.js");

class FolderController {
    constructor(repository) {
        this._repository = repository
    }

    async #getFolderId(id) {
        let folderId = id

        if (folderId === 'root') {
            const root = await this._repository.getRootFolder()
            folderId = root.id
        }

        return folderId
    }

    async view(req, res) {
        const {id} = req.params

        const folder = await this._repository.getFolderByIdWithChildren(
            await this.#getFolderId(id),
            req
        )

        res.status(StatusCode.OK).json({ data: folder })
    }

    async create(req, res) {
        const { body } = req

        const newFolder = await this._repository.createNewFolder(
            await this.#getFolderId(body.parentId),
            body.name
        )

        res.status(StatusCode.CREATED).json({ data: newFolder })
    }

    async update(req, res) {
        const { id } = req.params
        const {body} = req
        const updatedFolder = await this._repository.updateFolder(
            await this.#getFolderId(id),
            !!body.parentId ? await this.#getFolderId(body.parentId) : null,
            body.name ?? null
        )
        res.status(StatusCode.OK).json({ data: updatedFolder })
    }

    async delete(req, res) {
        const {id} = req.params
        await this._repository.removeFolder(
            await this.#getFolderId(id)
        )
        res.status(StatusCode.OK).json({ message: "Папка удалена" })
    }
}

module.exports = {FolderController}