const {StatusCode} = require("../../enums/status-code.js");
const bodyByStatusCode = (err) => {
    switch (err.code){
        case StatusCode.UNPROCESSABLE_ENTITY: return { message: err.message, errors: err.data }
        default: return { message: err.message }
    }
}

const ExceptionHandler = (server) => {
    const handler = (err, req, res, next) => {
        res.status(err.code ?? 500).json(bodyByStatusCode(err))
    }

    server.use(handler)
}

module.exports = { ExceptionHandler }