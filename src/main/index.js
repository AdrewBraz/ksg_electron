// @ts-check
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path';
import oracledb from 'oracledb';
import fs from 'fs';
import mongoose from 'mongoose';
import getPreparedData from './getPreparedData';
import excel from './excel';
import doms from './xml/doms';
import rmp from './xml/rmp';
import getData from './getData';
import createZip from './createZip'
import { ffoms, ksg as intKsg, listOfOmsRequests } from './requestStrings';
import dbfController from './dbf';
import excelParser from './excelParser';
import { medicalServList } from './utils/dbfUtils';
import compare from './compareLists'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [ oracledb.CLOB ];
const config = {
  user: 'OK',
  password: 'novlv',
  connectString: '172.16.11.23:1521/promis35',
};
// const uri = 'mongodb://nmic:nmic414@cluster0-shard-00-00.ps4d4.mongodb.net:27017,cluster0-shard-00-01.ps4d4.mongodb.net:27017,cluster0-shard-00-02.ps4d4.mongodb.net:27017/ksg?ssl=true&replicaSet=atlas-5qaoil-shard-0&authSource=admin&retryWrites=true&w=majority';
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).catch(err => console.log)

// const db = mongoose.connection;


  ipcMain.handle('ffomsChannel', async (e, id) => {
    const requestString = ffoms[id];
    console.log(id)
    const { vmpList, ksgList } = await getPreparedData(oracledb, config, requestString)
    if( id === 'excel'){
      if (fs.existsSync('C:/Users/User/Desktop/Выгрузка ФФОМС/ФФОМС.xlsx')) {
        fs.unlinkSync('C:/Users/User/Desktop/Выгрузка ФФОМС/ФФОМС.xlsx');
      }
      const result = await excel(vmpList, ksgList)
      return result
    }
  if (id === 'doms') {
      const xml = await doms({ ksgList, vmpList });
      await createZip(xml)
      return true
    }
    if (id === 'rmp') {
      const xml = await rmp({ ksgList, vmpList });
      await createZip(xml)
      return true
    }
  })

  ipcMain.handle('compare', async(e, id) => {
    console.log(ffoms['excel'])
    const { ksgList } = await getPreparedData(oracledb, config, ffoms['excel'])
    const interinKsg = await getData(oracledb, config, intKsg)

    const result = await compare(interinKsg, ksgList);
    return result
  })

  ipcMain.handle('megaChannel', async(e, id) => {
    const files = fs.readdirSync('C:/Users/User/Desktop/Мегаклиника');
    files.forEach((item) => {
      const name = item.slice(-3);
        if (name === 'dbf') {
          fs.unlinkSync(`C:/Users/User/Desktop/Мегаклиника/${item}`);
        }
    });
      const obj = {};
    for (const item of listOfOmsRequests) {
      const result = await getData(oracledb, config, item.req);
      const createDBF = dbfController[item.name];
      if (item.name === 'MU') {
        const interin = await excelParser();
        const res = medicalServList(result, interin);
          createDBF(res);
      } else {
        createDBF(result);
      }
    }

      return 'success';
  })
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
