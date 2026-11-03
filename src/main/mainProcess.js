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
import { service1974Query, validate1974Links } from './dbf/service1974';
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

  let currentExport;
  async function exportMega() {
    const connection = await oracledb.getConnection(config);
    const tables = {};
    let services;
    try {
      await connection.execute('set transaction read only');
      services = (await connection.execute(service1974Query)).rows;
      for (const { name, req } of listOfOmsRequests) {
        tables[name] = (await connection.execute(req)).rows;
      }
    } finally {
      await connection.close();
    }
    validate1974Links(services, tables);
    const files = listOfOmsRequests.map(({ name }) => name === 'MU'
      ? dbfController.MU(tables.MU, services)
      : dbfController[name](tables[name]));
    await dbfCreator('C:/Users/User/Desktop/Мегаклиника', files);
    return 'success';
  }
  ipcMain.handle('megaChannel', () => {
    if (!currentExport) currentExport = exportMega().finally(() => { currentExport = null; });
    return currentExport;
  })
}
