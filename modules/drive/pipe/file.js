const makeAbsolutePath = (req, filepath) => {
    return req.protocol + '://' + req.get('host') + "/" + filepath
}

const FilePipe = (file, req) => {
    return {
        id: file.id,
        file: {
            name: file.name,
            filepath: makeAbsolutePath(req, file.filepath)
        }
    }
}

module.exports = {FilePipe}