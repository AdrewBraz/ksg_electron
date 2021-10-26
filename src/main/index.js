// @ts-check
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path';
import oracledb from 'oracledb';
import fs from 'fs';
import AdmZip from 'adm-zip';
import mongoose from 'mongoose';
import { uniq } from 'lodash';
import { format } from 'date-fns';
import getData from './getData';
import getVmpData from './getVmpData';
import filterData from './filterData';
import dataBuilder from './dataBuilder';
import excel from './excel';
import parseKslp from './parseKslp';
import xml from './xml';
import createXml from './xml/createXml';
import { kslpStr, ffoms, ksg as intKsg, listOfOmsRequests } from './requestStrings';
import dbfController from './dbf';
import excelParser from './excelParser';
import { medicalServList } from './utils/dbfUtils';
import compare from './compareLists'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const config = {
  user: 'OK',
  password: 'novlv',
  connectString: '172.16.11.23:1521/promis35',
};
const uri = 'mongodb://nmic:nmic414@cluster0-shard-00-00.ps4d4.mongodb.net:27017,cluster0-shard-00-01.ps4d4.mongodb.net:27017,cluster0-shard-00-02.ps4d4.mongodb.net:27017/ksg?ssl=true&replicaSet=atlas-5qaoil-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.log)

const db = mongoose.connection;


  ipcMain.handle('ffomsChannel', async (e, id) => {
    if (fs.existsSync('C:/Users/User/Desktop/Выгрузка ФФОМС/ФФОМС.xlsx')) {
      fs.unlinkSync('C:/Users/User/Desktop/Выгрузка ФФОМС/ФФОМС.xlsx');
    }
    const requestString = ffoms[id];
    const data = await getData(oracledb, config, requestString);
    const kslpList = await getData(oracledb, config, kslpStr);
    const list = await parseKslp(kslpList);
    const { vmp, ksg } = await filterData(data, list);
    const vmpList = await getVmpData(vmp);
    const ksgList = await dataBuilder(ksg);
    if (id === 'excel') {
      const result = await excel(vmpList, ksgList);
      return result
    }
    if (id === 'xml') {
      
      const zip = new AdmZip();
      const x = await xml({ ksgList, vmpList });
      const date = format(new Date(), 'yyMMdd');
      const xmlCreated = await createXml(x, date);
      const stat = fs.statSync(`C:/Users/User/Desktop/Выгрузка ФФОМС//FM990089F00${date}.xml`);
      console.log(stat)
      const add = await zip.addLocalFile(`C:/Users/User/Desktop/Выгрузка ФФОМС//FM990089F00${date}.xml`);
      console.log(add)
      const zipFile = await zip.writeZip(`C:/Users/User/Desktop/Выгрузка ФФОМС/FM990089F00${date}.zip`);
      return true
    }
  })

  ipcMain.handle('compare', async(e, id) => {
    const data = await getData(oracledb, config, ffoms.excel);
    const interinKsg = await getData(oracledb, config, intKsg)
    const kslpList = await getData(oracledb, config, kslpStr);
    const list = await parseKslp(kslpList);
    const { ksg } = await filterData(data, list);
    const ksgList = await dataBuilder(ksg);
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
      console.log(result)
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
        preload: path.join(app.getAppPath(), '../preload', 'ui-bundle.js')
      }
    })
    // and load the index.html of the app.
    win.webContents.loadFile('../renderer/index.html')
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
  
  // .get('/dataMega',
  //   async (_req, reply) => {
  //     const files = fs.readdirSync('C:/Users/User/Desktop/Мегаклиника');
  //     files.forEach((item) => {
  //       const name = item.slice(-3);
  //       if (name === 'dbf') {
  //         fs.unlinkSync(`C:/Users/User/Desktop/Мегаклиника/${item}`);
  //       }
  //     });
  //     const obj = {};
  //     for (const item of listOfOmsRequests) {
  //       const result = await getData(oracledb, config, item.req);
  //       const createDBF = dbfController[item.name];
  //       if (item.name === 'MU') {
  //         const interin = await excelParser();
  //         const res = medicalServList(result, interin);
  //         createDBF(res);
  //       } else {
  //         createDBF(result);
  //       }
  //     }

  //     reply.send('success');
  //   });

