const optional = (value) => {

    return [
        value === undefined,
        "optional"
    ]
}

module.exports = { optional }