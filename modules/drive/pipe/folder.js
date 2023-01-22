const FolderPipe = (folder, needUserId = false) => {
    return {
        id: folder.id,
        name: folder.name,
        userId: needUserId ? String(folder.userId) : undefined,
    }
}

module.exports = {FolderPipe}