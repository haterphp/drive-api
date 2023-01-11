const isString = (value) => {
    return [
        typeof value === 'string',
        'Поле должно быть строкой'
    ]
}

module.exports = { isString }