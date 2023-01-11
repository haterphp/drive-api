const rootFolder = {
    parentId: null,
    name: 'root'
}

async function seeder(models) {
    const { Folder } = models
    await Folder.create(rootFolder)
}

module.exports = seeder