const swaggerUI = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Drive API',
            version: '1.0.0',
        },
    },
    apis: [
        './modules/auth/controllers/index.js',
        './modules/drive/controllers/file.js',
        './modules/drive/controllers/folder.js',
    ],
}

const registerSwaggerDoc = (server, route = '/swagger/doc') => {
    const spec = swaggerJsdoc(options)
    server.use(route, swaggerUI.serve, swaggerUI.setup(spec))
}

module.exports = { registerSwaggerDoc }