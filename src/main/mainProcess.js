// @ts-check
import { ipcMain } from 'electron'
import path from 'path';
import oracledb from 'oracledb';
import fs from 'fs';
import getPreparedData from './getPreparedData';
import excel from './excel';
import doms from './xml/doms';
import rmp from './xml/rmp';
import getData from './getData';
import createZip from './createZip'
import { ffoms, listOfOmsRequests, servStr, hospStr } from './requestStrings';
import dbfController from './dbf';
import dbfCreator from './dbf/dbfCreator.js';
import pdfCreator from './pdfCreator';
import startCloudXlsxSync from './cloudXlsxSync';
import i18n from 'i18n'
import { format } from 'date-fns'
import { difference } from 'lodash';

oracledb.initOracleClient()

export default () => {
  i18n.configure({
    locales: ['ru'],
    directory: path.join(__dirname, 'locales')
   })

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [ oracledb.CLOB ];
const config = {
  user: 'BRA',
  password: 'brabrobra',
  connectString: 'hc06.cc.cardio.ru:1521/promis35',
};

  startCloudXlsxSync({
    db: oracledb,
    dbConfig: config,
  });

  ipcMain.handle('ffomsChannel', async (e, id) => {
    const requestString = ffoms[id];
    const { vmpList, ksgList, emergencyList, fullList } = await getPreparedData(oracledb, config, requestString)
    console.log(vmpList.length, ksgList.length)
    // console.log(vmpList, ksgList, emergencyList, fullList)
    const listOfStac =Object.keys(vmpList).concat(Object.keys(ksgList), emergencyList.map(item => item.C_I))
    if( id === 'excel'){
      // if (fs.existsSync(`C:/Users/User/Desktop/Выгрузка ФФОМС/ФФОМС.xlsx`)) {
      //   fs.unlinkSync(`C:/Users/User/Desktop/Выгрузка ФФОМС/ФФОМС.xlsx`);
      // }
      const result = await excel(vmpList, ksgList, i18n)
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

  ipcMain.handle('pdf', async(e, id) => {
    console.log(id)
    if( id === 'serv'){
      const result = await getData(oracledb, config, servStr);
      await pdfCreator(result, `C:\\Users\\User\\Desktop\\PDF\\1974`)
      return true
    }
    if( id === 'hosp'){
      const result = await getData(oracledb, config, hospStr);
      await pdfCreator(result, `C:\\Users\\User\\Desktop\\PDF\\МГФОМС стационар`)
      return true
    }
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
      const [name, descriptors, records] = dbfController[item.name](result);
       await dbfCreator(name, descriptors, records)
    }

      return 'success';
  })
}
