const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const url = require('url')
const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()


const GroupDAO = require('./model/GroupDAO')
const TermDAO = require('./model/TermDAO')

let dao = {}



function createWindow() {
    const win = new BrowserWindow({
        title: "GREEK",
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadURL(process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    }));

}


const init = async () => {
    await app.whenReady()

    try {
        const text = fs.readFileSync(process.env.CONFIG || 'config.json')
        const settings = JSON.parse(text)
        db = new sqlite3.Database(settings.connection.storage)
        const initQuery = fs.readFileSync('sql/create-tables.sql').toString()
        db.run(initQuery)
        dao["group"] = new GroupDAO(db)
        await dao["group"].init()
        dao["term"] = new TermDAO(db)
        await dao["term"].init()
        
    }
    catch (err) {
        console.log("App failed to start because initialization returned an error:")
        console.log(err)
    }
}

init().then(() => {

    ipcMain.handle('query', async (_, name, args) => {
        const parts = name.split(':')
        if (parts.length !== 2) throw Error('Invalid operation format')
        return await dao[parts[0]].op(parts[1], args)
    })

    createWindow()
})
.catch(err => {
    console.log(err)
})