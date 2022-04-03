const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    showMessage: (msg) => ipcRenderer.invoke('dialog:showMessage', msg),
    writeToFile: (path, content) => ipcRenderer.invoke('writeToFile', path, content)
  })
