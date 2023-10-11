const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('model', {
    query: (name, args) => ipcRenderer.invoke('query', name, args)
})