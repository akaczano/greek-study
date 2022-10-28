const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    loadVocab: () => ipcRenderer.sendSync('loadVocab'),
    saveVocab: vocab => ipcRenderer.invoke('saveVocab', vocab)
})