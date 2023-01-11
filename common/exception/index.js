class AppException extends Error {
    constructor(code, data = {}) {
        super();

        this.name = this.constructor.name

        this.code = code.code
        this.message = code.message

        this.data = data
    }

    static new(code, data) {
        return new AppException(code, data)
    }
}

module.exports = { AppException }