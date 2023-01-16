const e = require("express");
const {StatusCode} = require("../../enums/status-code.js");
const {AppException} = require("../exception/index.js");
const validate = (schema) => {
    return (req, res, next) => {
        if (!schema) return next()
        const body = { ...req.body, ...req.files }
        const errors = {}

        Object.entries(schema).forEach(([key, validators]) => {
            validators.forEach((validator) => {
                if (!!errors[key]) return
                const [isValid, message] = validator(body[key])
                if (message === 'optional' && isValid) {
                    errors[key] = message
                    return
                }
                if (!isValid && message !== 'optional') errors[key] = message
            })
        })

        if (Object.values(errors).filter((item) => item !== 'optional').length !== 0) {
            throw AppException.new({
                code: StatusCode.UNPROCESSABLE_ENTITY,
                message: "Validation errors"
            }, Object.keys(errors)
                .map((key) => errors[key] === 'optional' ? null : key)
                .reduce((prev, key) => {
                    if (key === null) return prev
                    return { ...prev, [key]: errors[key] }
                }, {})
            )
        }
        return next()
    }
}

module.exports = { validate }

