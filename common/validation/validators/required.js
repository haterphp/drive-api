const required = (passNull = false) => (value) => {
    
    const message = 'Это поле обязательно'

    return [
        value !== '' && value !== undefined && (!passNull && value !== null),
        message
    ]
}

module.exports = { required }