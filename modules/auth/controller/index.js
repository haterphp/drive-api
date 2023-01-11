const {StatusCode} = require("../../../enums/status-code.js");

class AuthController {
    constructor(repository) {
        this._repository = repository
    }

    async register(req, res) {
        const { body } = req

        const user = await this._repository.createUserData(body.login, body.password)
        const token = await this._repository.login(user, body)

        res.status(StatusCode.CREATED).json({
            token
        })
    }

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