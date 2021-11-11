import getData from './getData';
import getVmpData from './getVmpData';
import filterData from './filterData';
import dataBuilder from './dataBuilder';
import parseKslp from './parseKslp';
import { kslpStr } from './requestStrings';


export default async(db, config, request) => {
  const data = await getData(db, config, request);
  const kslpList = await getData(oracledb, config, kslpStr);
  const list = await parseKslp(kslpList);
  const { vmp, ksg } = await filterData(data, list);
  const vmpList = await getVmpData(vmp);
  const ksgList = await dataBuilder(ksg);
  return { vmpList, ksgList}
}