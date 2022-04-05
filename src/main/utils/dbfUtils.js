import { findIndex } from 'lodash';
import { DayCalculation } from './utils.js'

const reg = new RegExp(/\w\d\d$/);
const replaceDs = (ds) => (ds === 'I10' ? ds : ds.replace(reg, '$&.0'));

const replaceOrg = (org) => (['201', '203', '204', '206', '211', '215', '216', null].includes(org) ? '198' : org);

const replaceDoc = (cod) => {
  switch (cod) {
    case '36665':
      return '22061';
    case '33944':
      return '12543';
    case '37830':
      return '12543';
    case '20881':
      return '32862';
    case '12364':
      return '32862';
    case '34470':
      return '35744';
    case '40017':
      return '';
    case '39777':
      return '32042';
    case '39089':
      return '32042';
    case '39301':
      return '32042';
    case '34430':
      return '32042';
    case '36445':
      return '32042';
    case '36467':
      return '21681';
    case '28918':
      return '34322';
    case '18463':
      return '34322';
    case null:
      return '22023';
    default:
      return cod;
  }
};

const medicalServList = (list, interin) => {
  let patient;
  let ds;

  const l1 = list.filter((el) => interin[`${el.SRV_ID}`] !== undefined).map((el) => {
    const {
      SRV_ID, COD_U, DS, ORG_ID,
    } = el;
    const diag = !DS ? 'I10' : replaceDs(DS);
    const doc = replaceDoc(COD_U);
    const org = replaceOrg(ORG_ID);
    const cod = interin[`${SRV_ID}`];
    return {
      ...el, DS: diag, COD_U: doc, ORG_ID: org, COD: cod, MU_TYPE: '1', IS_PRIM: '1',
    };
  });
  const l2 = l1.reduce((acc, item) => {
    const { PATIENT, D_U, COD } = item;
    const index = findIndex(acc, { PATIENT, D_U, COD });
    if (index < 0) {
      acc.push(item);
      return acc;
    }
    const { K_U } = acc[index];
    acc[index].K_U = K_U + 1;
    return acc;
  }, []);
  return l2;
};

const ICUOrg = ['201', '203', '215', '211'];

const getICUCode = (days) => {
  switch (days) {
    case days <= 2:
      return '83010'
    case days => 2 && days <=4:
      return '83020'
    case days => 5 && days <=6:
      return '83030'
    case days => 7 && days <=8:
      return '83040'
    case days > 8:
      return '83050'
    default:
      return '83010'
  }
}

const getHospList = (list) => {
  let state = '';
  let count = 1;
  return list.reduce((acc, item, i) => {
    const { PATIENT, C_I, COD_U, D_B, D_TIME, DDS, COD, PROG, TIP, D_TYPE, MCOD, CODE, RESULT } = item;
    if(item.KIND === 'ПОЛОЖЕН'){
      count = 1;
      const obj = { PATIENT, C_I, ND: count, COD_U, D_B, D_U: '', T_B: D_TIME, T_U: '', K_U: '', K_UH: 0, DDS, COD: '', PROG, TIP, D_TYPE, MCOD, CODE };
      count = count + 1;
      acc.push(obj)
      return acc
    } else if(item.KIND === 'ПЕРЕВЕДЕН'){
      acc[acc.length - 1].D_U = D_B;
      acc[acc.length - 1].T_U = D_TIME;
      acc[acc.length - 1].COD = getICUCode(acc[acc.length - 1].K_U);
      const obj = { PATIENT, C_I, ND: count, COD_U, D_B, D_U: '', T_B: D_TIME, T_U: '', K_U: '', K_UH: 0, DDS, COD: '', PROG, TIP, D_TYPE, MCOD, CODE };
      count = count + 1;
      acc.push(obj)
      return acc
    } else if(item.KIND === 'ВЫПИСАН'){
      acc[acc.length - 1].D_U = D_B;
      acc[acc.length - 1].T_U = D_TIME;
      acc[acc.length - 1].K_U = 0
      return acc;
    }
  }, [])
}

export { medicalServList, getHospList };
