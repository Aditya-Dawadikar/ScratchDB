const fs = require("fs")

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function createFolder(folder_name) {
    try {
        if (!fs.existsSync(folder_name)) {
            fs.mkdirSync(folder_name);
        }
    } catch (err) {
        console.error(err);
    }
}

function writeJson(file_name, json_object) {
    let buff = Buffer.from(JSON.stringify(json_object))
    fs.writeFileSync(file_name, buff, (err) => {
        if (err) {
            console.error(err)
        }
        console.log(`${formatBytes(Buffer.byteLength(buff))} written to ${file_name}`)
    })
}

function writeJsonSync(file_name, json_object) {
    let buff = Buffer.from(JSON.stringify(json_object))
    fs.writeFileSync(file_name, buff)
    console.log(`${formatBytes(Buffer.byteLength(buff))} written to ${file_name}`)
}

function readJson(file_name) {
    fs.readFile(file_name, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return null
        }
        return JSON.parse(data)
    })
}

function readJsonSync(file_name) {
    const data = fs.readFileSync(file_name, 'utf8')
    return JSON.parse(data)
}

function deleteJsonSync(file_name) {
    try {
        if (fs.existsSync(file_name)) {
            fs.unlinkSync(file_name)
        }
    } catch (err) {
        console.error(err)
    }
}

function fileExistsSync(file_path){
    return fs.existsSync(file_path)
}

module.exports = {
    createFolder,
    writeJson,
    writeJsonSync,
    readJson,
    readJsonSync,
    deleteJsonSync,
    fileExistsSync
}