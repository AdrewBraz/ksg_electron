import { find } from 'lodash';
import interinController from './controller/interinController';
import { allUsl } from './controller/index';
import { allUsl as allDayUsl } from './controller/ds';

const vmpCodes = ['200409', '200510', '200518', '200519', '200520', '200524', '200522', '200523', '200525', '200530'];

const checkPATOLOGY = (item, kslp) => {
  const { diab, hiv, hyper } = kslp;
  if(find(diab, {C_I: item.C_I})){
    return  item.PATOLOGY = 'E11.9'
  } else if(find(hiv, {C_I: item.C_I})){
    return  item.PATOLOGY = 'I27.8';
  } else if( find(hyper, {C_I: item.C_I})){
    return item.PATOLOGY = 'I27.0';
  } else {
    return  item.PATOLOGY = ''
  }
}

export default async (data, kslp) => {
  const interinCodes = await interinController();
  const hospServList = await allUsl();
  const dayServList = await allDayUsl();
  const splitOmsData = data.reduce((acc, item) => {
    vmpCodes.includes(item.COD) ? acc.vmpList.push(item) : acc.ksgList.push(item);
    return acc;
  }, { vmpList: [], ksgList: [] });
  const { ksgList, vmpList } = splitOmsData;
  const vmp = vmpList.map((item) => {
    return item;
  });
  const ksg = ksgList.map((item) => {
    checkPATOLOGY(item, kslp)
    if (parseInt(item.C_I.slice(5)) >= 30000) {
      if (dayServList.includes(item.SRV_CODE)) {
        return item;
      }
      const interin = interinCodes.filter((i) => i.COD === item.SRV_CODE);
      item.SRV_CODE = interin.length > 0 ? interin[0].COD_USL : null;
      return item;
    }
    if (hospServList.includes(item.SRV_CODE)) {
      return item;
    }
    const interin = interinCodes.filter((i) => i.COD === item.SRV_CODE);
    item.SRV_CODE = interin.length > 0 ? interin[0].COD_USL : null;
    return item;
  }).filter((item) => item.DDS !== 'U07.1' && item.DDS !== 'U07.2');
  return { vmp, ksg };
};
