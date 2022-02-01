import getData from './getData';
import getVmpData from './getVmpData';
import filterData from './filterData';
import dataBuilder from './dataBuilder';
import rmpData from './rmpData'
import parseKslp from './parseKslp';
import { vmpReq, kslpStr } from './requestStrings';


export default async(db, config, request) => {
  console.log(request)
  const ksgData = await getData(db, config, request);
  const vmp = await getData(db, config, vmpReq);
  const kslpList = await getData(db, config, kslpStr);
  const list = await parseKslp(kslpList);
  const { ksg } = await filterData(ksgData, list);
  const vmpList = await getVmpData(vmp);
  const ksgList = rmpData(ksg)
  return {vmpList, ksgList}
}