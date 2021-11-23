import { uniqBy, find } from 'lodash';

const calculateKslp = (age, patology = null, days = 0) => {
  let kslp = 1;
  if (age > 75) {
    kslp = 1.1;
  }
  if (days > 30) {
    kslp = 1.4;
  }
  if (patology) {
    kslp = 1.8;
  }
  return kslp;
};

const abourtedRatio = (days) => {
  if (days <= 2) {
    return 0.3;
  }
  if (days >= 3 && days <= 5) {
    return 0.5;
  }
  return 0.8;
};

const calculateKsg = (KOEF_Z = 0.1, age, finalCode = 0, patology, days, condition) => {
  const SRED_NFZ = condition === 1 ? 56680.9 : 25617.30;
  const KOEF_PRIV = condition === 1 ? 0.41 : 0.52;
  const KOEF_SPEC = KOEF_Z >= 2 ? 1.4 : 0.8;
  const KOEF_D = 1.672;
  let KOEF_PRERV = 1;
  const kslp = calculateKslp(age, patology, days);
  const SUMV = Math.round(((SRED_NFZ * KOEF_PRIV * KOEF_SPEC * KOEF_Z * kslp * KOEF_D) + Number.EPSILON)*100)/100;
  if (finalCode !== '0') {
    KOEF_PRERV = abourtedRatio(days);
    return { SRED_NFZ, KOEF_D, KOEF_PRIV, KOEF_SPEC, KOEF_PRERV, KOEF_Z, SUMV: Math.round(((SUMV * KOEF_PRERV) +  + Number.EPSILON)*100)/100};
  }
  return { SRED_NFZ, KOEF_D, KOEF_PRIV, KOEF_SPEC, KOEF_PRERV, KOEF_Z, SUMV }
};

const getRatioByUsl = (cod, list, days, type, c_i) => {
  const item = find(list, { COD_USL: cod, MKB_1: '' })
    ? find(list, { COD_USL: cod, MKB_1: '' })
    : find(list, { COD_USL: cod, MKB_1: 'I.' });
  if (!item) {
    return 0;
  }
  const ratio = item.RATIO;
  const ksg = item.KSG;
  const ksgName = item.KSG_NAME;
  const group = item.GROUP_NUM;
  if (group === 235 && days <= 3 && type === 1) {
    return {
      ratio, ksg, ksgName, group,
    };
  }
  if (group === 113 && days <= 1 && type === 2) {
    return {
      ratio, ksg, ksgName, group,
    };
  }
  if (group === 235 && days > 3) {
    return { ratio: 0 };
  }
  return {
    ratio, ksg, ksgName, group,
  };
};

const getRatio = (dds, list, cod = '', days, uslList, type) => {
  const item = find(list, { MKB_1: dds, COD_USL: cod });
  const obj1 = {}
  const obj2 = {}
  if (item === undefined) {
    const {
      ratio, ksg, ksgName, group,
    } = getRatioByUsl(cod, uslList, days, type);
    return {
      ratio, ksg, ksgName, group,
    };
  }
  if (cod && days <= 3) {
    const {
      ratio, ksg, ksgName, group,
    } = getRatioByUsl(cod, uslList, days, type)
    obj1.ratio = ratio;
    obj1.ksg = ksg;
    obj1.ksgName =ksgName;
    obj1.group = group;
  }
  if (item) {
    obj2.ratio = item.RATIO;
    obj2.ksg = item.KSG;
    obj2.ksgName = item.KSG_NAME;
    obj2.group = item.GROUP_NUM;
  }
  return obj1.ratio > obj2.ratio ? obj1 : obj2
};

export { getRatio, calculateKsg, calculateKslp };
