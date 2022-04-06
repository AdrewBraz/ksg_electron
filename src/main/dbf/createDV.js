//@ts-check
import { getHospList } from '../utils/dbfUtils.js';

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default (list) =>{
  const res = getHospList(list)
  const fieldDescriptors = [
    { name: 'PATIENT', type: 'C', size: 7 },
    { name: 'C_I', type: 'C', size: 10 },
    { name: 'ND', type: 'N', size: 4 },
    { name: 'COD_U', type: 'C', size: 5 },
    { name: 'D_B', type: 'D', size: 8 },
    { name: 'D_U', type: 'D', size: 8 },
    { name: 'T_B', type: 'C', size: 5 },
    { name: 'T_U', type: 'C', size: 5 },
    { name: 'K_U', type: 'N', size: 5 },
    { name: 'K_UH', type: 'N', size: 4 },
    { name: 'DDS', type: 'C', size: 6 },
    { name: 'COD', type: 'C', size: 6 },
    { name: 'PROG', type: 'C', size: 5 },
    { name: 'TIP', type: 'C', size: 3 },
    { name: 'D_TYPE', type: 'C', size: 3 },
    { name: 'MCOD', type: 'C', size: 9 },
    { name: 'CODE', type: 'C', size: 4 },
    { name: 'CHD', type: 'D', size: 8 },
  ];
  const records = res.map(item => {
    const { PATIENT, C_I, COD_U, D_B, D_U, ND, T_B, T_U, DDS, COD, PROG, TIP, D_TYPE, CODE, RESULT } = item;
    console.log(ND)
    return {
      PATIENT: `${PATIENT}`,
      C_I: `${C_I}`,
      ND,
      COD_U: COD_U || '32042',
      D_B,
      D_U,
      T_B,
      T_U,
      K_U: 1,
      K_UH: 0,
      DDS: !DDS ? 'I10' : `${DDS}`,
      COD,
      PROG: 'ОМСМК',
      TIP: `0`,
      D_TYPE: `0`,
      MCOD: '4144978_1',
      CODE: `${CODE}`,
      CHD: new Date(),
    };
  })

  return ['DV', fieldDescriptors, records]
}