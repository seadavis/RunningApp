const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    writeToFile: (path, content) => ipcRenderer.invoke('writeToFile', path, content)
  })
