import getData from './getData';
import getVmpData from './getVmpData';
import dataBuilder from './dataBuilder';
import rmpData from './rmpData'
import parseKslp from './parseKslp';
import { vmpReq, kslpStr } from './requestStrings';


export default async(db, config, request) => {
  const ksgData = await getData(db, config, request);
  const vmp = await getData(db, config, vmpReq);
  // console.log(vmp)
  const vmpList = await getVmpData(vmp);
  const ksgList = rmpData(ksgData)
  return {vmpList, ksgList}
}