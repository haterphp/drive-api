const {StatusCode} = require("../../../enums/status-code.js");

/**
 * @openapi
 * tags:
 *    - name: Files
 *      description: Набор ендпоинтов для управления файлами
 */
class FileController {

    constructor(repository) {
        this._repository = repository
    }
    /**
     * @openapi
     * /drive/files:
     *  post:
     *      tags:
     *          - Files
     *      summary: Загрузка файла на сервер
     *      requestBody:
     *          content:
     *              multipart/form-data:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          folderId:
     *                              type: string
     *                              example: 63be49b4055e4fd61d684195
     *                          file:
     *                              type: string
     *                              format: binary
     *      responses:
     *          201:
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              id:
     *                                  type: string
     *                                  example: 63c66cfeffc4f4e79492e403
     *                              file:
     *                                  type: object
     *                                  properties:
     *                                      name:
     *                                          type: string
     *                                          example: image_2023-01-16_16-32-44.png
     *                                      filepath:
     *                                          type: string
     *                                          example: host/uploads/image_2023-01-16_16-32-44.png
     */
    async create (req, res) {
        const {body, files} = req
        const file = await this._repository.create(files.file, body.folderId, req, req.user.id)
        res.status(StatusCode.CREATED).json(file)
    }

    /**
     * @openapi
     * /drive/files/{id}:
     *  delete:
     *      tags:
     *          - Files
     *      summary: Удаление файла
     *      responses:
     *          200:
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Файл успешно удален
     */
    async remove (req, res) {
        const {id} = req.params
        await this._repository.remove(id, req.user.id)
        res.status(StatusCode.OK).json({ message: "Файл успешно удален" })
    }

}

module.exports = { FileController }