const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const url = require('url')
const path = require('path')
const fs = require('fs')

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

let vocab = [];

const init = async () => {
    await app.whenReady()
    const vocabText = fs.readFileSync('vocab.json')
    vocab = JSON.parse(vocabText)
    ipcMain.on('loadVocab', (event, _) => {        
        event.returnValue = vocab
    })
    ipcMain.handle('saveVocab', async (_, v) => {
        vocab = v
        fs.writeFile('vocab.json', JSON.stringify(v), err => {
            console.log(err)
        })
    })
}


init().then(() => {    
    createWindow()    
})
.catch(err => {
    console.log(err)
})