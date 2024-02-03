const { StatusCode } = require("../../../enums/status-code.js");

/**
 * @openapi
 * tags:
 *    - name: Folders
 *      description: Набор ендпоинтов для управления папками
 *
 * components:
 *      schemas:
 *          ChildFolder:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      example: 63be49b4055e4fd61d684195
 *                  name:
 *                      type: string
 *                      example: Photos
 *                  type:
 *                      type: string
 *                      example: folder
 *
 *          ChildFile:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      example: 63be49b4055e4fd61d684195
 *                  file:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: image_2023-01-16_16-32-44.png
 *                          filepath:
 *                              type: string
 *                              example: host/uploads/image_2023-01-16_16-32-44.png
 *                  type:
 *                      type: string
 *                      example: file
 *          Folder:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      example: 63be49b4055e4fd61d684195
 *                  name:
 *                      type: string
 *                      example: Photos
 */
class FolderController {
  constructor(repository) {
    this._repository = repository;
  }

  async #getFolderId(id, userId) {
    let folderId = id;

    if (folderId === "root") {
      const root = await this._repository.getRootFolder(userId);
      folderId = root.id;
    }

    return folderId;
  }

  /**
   * @openapi
   * /drive/folder/{id}:
   *  get:
   *      tags:
   *          - Folders
   *      summary: Просмотр папки
   *      description: id - ID родительской папки или 'root'
   *      responses:
   *          200:
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              data:
   *                                   type: object
   *                                   properties:
   *                                      id:
   *                                          type: string
   *                                          example: 63be49b4055e4fd61d684195
   *                                      name:
   *                                          type: string
   *                                          example: Photos
   *                                      children:
   *                                          type: array
   *                                          items:
   *                                              oneOf:
   *                                                  - $ref: '#/components/schemas/ChildFolder'
   *                                                  - $ref: '#/components/schemas/ChildFile'
   *
   *
   */

  async view(req, res) {
    const { id } = req.params;

    const folder = await this._repository.getFolderByIdWithChildren(
      await this.#getFolderId(id, req.user.id),
      req
    );

    res.status(StatusCode.OK).json({ data: folder });
  }

  /**
   * @openapi
   * /drive/folder:
   *  post:
   *      tags:
   *          - Folders
   *      summary: Создание папки
   *      requestBody:
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          parentId:
   *                              type: string
   *                              example: root или id папки (63be49b4055e4fd61d684195)
   *                          name:
   *                              type: string
   *                              example: Photos
   *      responses:
   *          201:
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              data:
   *                                      $ref: '#/components/schemas/Folder'
   *
   *
   */

  async create(req, res) {
    const { body } = req;

    const newFolder = await this._repository.createNewFolder(
      await this.#getFolderId(body.parentId, req.user.id),
      body.name,
      req.user.id
    );

    res.status(StatusCode.CREATED).json({ data: newFolder });
  }

  /**
   * @openapi
   * /drive/folder/{id}:
   *  patch:
   *      tags:
   *          - Folders
   *      summary: Редактирование папки
   *      requestBody:
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          parentId:
   *                              type: string
   *                              example: root или id папки (63be49b4055e4fd61d684195)
   *                          name:
   *                              type: string
   *                              example: Photos
   *      responses:
   *          200:
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              data:
   *                                  $ref: '#/components/schemas/Folder'
   *
   *
   */

  async update(req, res) {
    const { id } = req.params;
    const { body } = req;
    const updatedFolder = await this._repository.updateFolder(
      await this.#getFolderId(id, req.user.id),
      !!body.parentId
        ? await this.#getFolderId(body.parentId, req.user.id)
        : null,
      body.name ?? null,
      req.user.id
    );
    res.status(StatusCode.OK).json({ data: updatedFolder });
  }

  /**
   * @openapi
   * /drive/folder/{id}:
   *  delete:
   *      tags:
   *          - Folders
   *      summary: Удаление папки
   *      responses:
   *          200:
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              message:
   *                                  type: object
   *                                  example: Папка успешно удалена
   *
   *
   */

  async delete(req, res) {
    const { id } = req.params;
    await this._repository.removeFolder(
      await this.#getFolderId(id, req.user.id),
      req.user.id
    );
    res.status(StatusCode.OK).json({ message: "Папка удалена" });
  }
}

module.exports = { FolderController };
