const {StatusCode} = require("../../../enums/status-code.js");

/**
 * @openapi
 * tags:
 *    - name: Authorization
 *      description: Набор ендпоинтов для авторизация и регистрации
 */
class AuthController {
    constructor(repository) {
        this._repository = repository
    }

    /**
     * @openapi
     * /auth/register:
     *  post:
     *      tags:
     *          - Authorization
     *      summary: Регистрация
     *      requestBody:
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          login:
     *                              type: string
     *                              example: test-1
     *                          password:
     *                              type: string
     *                              example: test-1
     *      responses:
     *          201:
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              token:
     *                                  type: string
     *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QtMiIsImlhdCI6MTY3MzMzNjE0N30.XtWkcsTDY1ju38lZhByiU6HmDh-OnyrSS7seEHcvcG8
     */
    async register(req, res) {
        const { body } = req

        const user = await this._repository.createUserData(body.login, body.password)
        const token = await this._repository.login(user, body)

        res.status(StatusCode.CREATED).json({
            token
        })
    }

    /**
     * @openapi
     * /auth/login:
     *  post:
     *      tags:
     *          - Authorization
     *      summary: Авторизация
     *      requestBody:
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          login:
     *                              type: string
     *                              example: test-1
     *                          password:
     *                              type: string
     *                              example: test-1
     *      responses:
     *          200:
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              token:
     *                                  type: string
     *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QtMiIsImlhdCI6MTY3MzMzNjE0N30.XtWkcsTDY1ju38lZhByiU6HmDh-OnyrSS7seEHcvcG8
     */
    async login(req, res) {
        const { body } = req

        const user = await this._repository.getUserData(body.login)
        const token = await this._repository.login(user, body)

        res.status(StatusCode.OK).json({
            token
        })
    }

}

module.exports = { AuthController }