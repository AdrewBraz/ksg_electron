import { find } from 'lodash';
import interinController from './controller/interinController';
import { allUsl } from './controller/index';
import { allUsl as allDayUsl } from './controller/ds';

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
  const ksg = data.map((item) => {
    checkPATOLOGY(item, kslp)
    const calculateDays = Math.round((item.OUT_DATE.getTime() - item.IN_DATE.getTime()) / (24 * 3600 * 1000));
    if (parseInt(item.C_I.slice(5)) >= 30000) {
      if (dayServList.includes(item.SRV_CODE)) {
        item.DAYS = (Math.floor(calculateDays) + 1)
        item.DIFF_CRITERIA = item.DAYS === 1 ? 'pbt' : ''
        return item;
      }
      const interin = interinCodes.filter((i) => i.COD === item.SRV_CODE);
      item.SRV_CODE = interin.length > 0 ? interin[0].COD_USL : null;
      item.DAYS = (Math.floor(calculateDays) + 1)
      item.DIFF_CRITERIA = item.DAYS === 1 ? 'pbt' : ''
      return item;
    }
    if (hospServList.includes(item.SRV_CODE)) {
      item.DAYS = calculateDays;
      item.DIFF_CRITERIA = '';
      return item;
    }
    const interin = interinCodes.filter((i) => i.COD === item.SRV_CODE);
    item.SRV_CODE = interin.length > 0 ? interin[0].COD_USL : null
    item.DAYS = calculateDays;
    item.DIFF_CRITERIA = '';
    return item;
  }).filter((item) => item.DDS !== 'U07.1' && item.DDS !== 'U07.2');
  return { ksg };
};
