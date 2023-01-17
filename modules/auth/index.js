const {Router} = require('express')
const {register} = require("../../common/routing.js");

const {AuthController} = require("./controllers/index.js");
const {AuthRepository} = require("./repository/index.js");

const {validate} = require("../../common/validation/index.js");

const {CreateUserSchema} = require("./schemas/create-user-schema.js");
const {LoginUserSchema} = require("./schemas/login-user-schema.js");


const prefix = '/auth'
const AuthModel = (app) => {
    const router = Router()
    const repository = new AuthRepository(app.db)
    const controller = new AuthController(repository)

    router.post( '/login', validate(LoginUserSchema), register(controller.login.bind(controller)))
    router.post( '/register', validate(CreateUserSchema), register(controller.register.bind(controller)))

    return { router, prefix }
}

module.exports = AuthModel