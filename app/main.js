const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const url = require('url')
const path = require('path')
const fs = require('fs')

const DataAccessObject = require('./dao')

const dao = new DataAccessObject()

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
    const text = fs.readFileSync(process.env.CONFIG || 'config.json')
    const settings = JSON.parse(text)
    const ret = await dao.init(settings.connection)
    if (ret != 0) {
        throw 'Failed to initialize database'
    }
}

init().then(() => {    
    ipcMain.handle('query', async (_, query, params) => await dao.query(query, params)),
    ipcMain.handle('insert_chart', async(_, chart) => await dao.insertChart(chart))    
    createWindow()    
})
.catch(err => {
    console.log(err)
})