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
import { ffoms, ksg as intKsg, listOfOmsRequests } from './requestStrings';
import dbfController from './dbf';
import dbfCreator from './dbf/dbfCreator.js';
import excelParser from './excelParser';
import { medicalServList } from './utils/dbfUtils';

export default () => {

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [ oracledb.CLOB ];
const config = {
  user: 'OK',
  password: 'novlv',
  connectString: '172.16.11.23:1521/promis35',
};

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
      console.log(item.name)
      const [name, descriptors, records] = dbfController[item.name](result);
       await dbfCreator(name, descriptors, records)
    }

      return 'success';
  })
}