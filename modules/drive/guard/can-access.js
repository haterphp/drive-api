const {AppException} = require("../../../common/exception/index.js");
const {StatusCode} = require("../../../enums/status-code.js");
const CanAccess = (Entity) => async (req, res, next) => {
    if(!req.user) return next()
    const entity = await Entity.find({ userId: req.user.id })
    if (entity !== null) return next()
    throw AppException.new({
        code: StatusCode.FORBIDDEN,
        message: "У вас нет доступа"
    })
}

module.exports = {CanAccess}