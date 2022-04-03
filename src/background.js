'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const fs = require('fs').promises;
let win = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
 win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //if (!process.env.IS_TEST) 
      //win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  } 
 
}

async function handleFileOpen() {

  //try{
    console.log("File Open Clicked")
    const { canceled, filePaths } = await dialog.showOpenDialog()
    const filePath =  filePaths[0];
    const fileData = await fs.readFile(filePaths[0])
    console.log(`Read FileData: ${fileData}`)
    if (canceled) {
      return null;
    }
  
    if(fileData == null){
      return null;
    }
  
    return {
      filePath: filePaths[0],
      points: JSON.parse(fileData)
    }
  //}
  //catch{
    //return null;
  //}
 
  
}

async function handleShowMessage(event, msg){
  console.log(`Opening Window with Message: ${msg}`);
  await dialog.showMessageBox(win, {message: msg, title: "Running App"});
}


async function handleWriteToFile(event, path, content){
  try{
    await fs.writeFile(path, content);
    return true;
  }
  catch(exception){

    let msg = null
    if(exception.code == 'EPERM'){
      msg =  `Could not write to ${exception.path} due to permissions`
    }
    else{
      msg = `Could not write to ${exception.path}`
    }
    await dialog.showMessageBox(win, {message: msg, title: "Running App Error!"});
    return false;
  }
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()

  
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('writeToFile', handleWriteToFile)
  ipcMain.handle('dialog:showMessage', handleShowMessage)
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
