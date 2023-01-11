const {AuthRepository} = require("../repository/index.js");
const {AppException} = require("../../../common/exception/index.js");
const {StatusCode} = require("../../../enums/status-code.js");
const AuthGuard = (db) => {
    const repository = new AuthRepository(db)

    return async (req, _res, next) => {
        try {
            const token = req.headers.authorization?.replace('Bearer', '').trim() ?? ""
            const user = await repository.verify(token)
            if (user) req.user = user
            else {
                next(AppException.new(
                    {code: StatusCode.UNAUTHORIZED, message: 'Вам нужна авторизация'}
                ))
            }
            next()
        } catch (e) {
            next(AppException.new(
                {code: StatusCode.UNAUTHORIZED, message: 'Вам нужна авторизация'}
            ))
        }
    }
}

module.exports = {AuthGuard}