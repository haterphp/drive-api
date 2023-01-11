const jwt = require('jsonwebtoken')

const {AppException} = require("../../../common/exception/index.js");
const {StatusCode} = require("../../../enums/status-code.js");

class AuthRepository {
    constructor(db) {
        this.model = db.models.User
    }

    async getUserData(login) {
        return await this.model.findOne({ login })
    }

    async createUserData(login, password) {
        try {
            return await this.model.create({ login, password })
        } catch (e) {
            throw AppException.new({ code: StatusCode.FORBIDDEN, message: 'Пользователь с таким логином уже существует' })
        }
    }

    async login (user, credentials) {
        try {
            if (user && user.login === credentials.login && user.comparePassword(credentials.password)) {
                return jwt.sign({ login: user.login }, process.env.JWT_SECRET)
            } else {
                throw AppException.new({
                    code: StatusCode.NOT_FOUND,
                    message: "Пользователь с таким логином и паролем не найдены"
                })
            }
        } catch (e) {
            throw e
        }
    }

    async verify (token) {
        try {
            const {login} = jwt.verify(token, process.env.JWT_SECRET)
            return await this.getUserData(login)
        } catch (e) {
            throw e
        }
    }

}

module.exports = { AuthRepository }