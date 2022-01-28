import getData from './getData';
import getVmpData from './getVmpData';
import filterData from './filterData';
import dataBuilder from './dataBuilder';
import rmpData from './rmpData'
import parseKslp from './parseKslp';
import { vmpReq, xml } from './requestStrings';


export default async(db, config, request) => {
  const ksg = await getData(db, config, xml);
  const vmp = await getData(db, config, vmpReq);
  const list = await parseKslp(kslpList);
  const { vmp, ksg } = await filterData(data, list);
  const vmpList = await getVmpData(vmp);
  const ksgList = rmpData(ksg)
  return { vmpList, ksgList: ksg}
}