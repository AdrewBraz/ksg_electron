// @ts-check
import { app, BrowserWindow} from 'electron'
import mainProcess from './mainProcess';
import path from 'path';

mainProcess()
  const createWindow = () => {
    // Create the browser window.
    let win = new BrowserWindow({
      title: 'Excel',
      width: 900,
      height: 600,
      minWidth: 600,
      minHeight: 400,
      backgroundColor: '#5C7CA7',
      frame: true,
      show: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        webSecurity: false,
        preload: path.join(app.getAppPath(), '../preload', 'ui-bundle.js')
      }
    })
    // and load the index.html of the app.
    win.webContents.loadFile( path.join(__dirname, '../renderer/index.html'))
    win.webContents.openDevTools()
    win.on('ready-to-show', () => {
      win.show()
    })
    // send data to renderer process
    // win.webContents.on('did-finish-load', () => {
    //   win.webContents.send('mainchannel', {message: 'fuck this shit'})
    // })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  
  app.on('window-all-closed', () => {
    if(process.platform !== "darwin"){
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
      createWindow()
    }
  })
  
  app.whenReady().then(createWindow)
