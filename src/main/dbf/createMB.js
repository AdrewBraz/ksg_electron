//@ts-check

export default (list) => {
  const fieldDescriptors = [
    { name: 'PATIENT', type: 'C', size: 36 },
    { name: 'C_I', type: 'C', size: 30 },
    { name: 'T_CI', type: 'C', size: 2 },
    { name: 'MB_STAT', type: 'C', size: 2 },
    { name: 'DORD_N', type: 'C', size: 30 },
    { name: 'AP_ID', type: 'C', size: 36 },
    { name: 'H_TYP', type: 'C', size: 1 },
    { name: 'SRC', type: 'C', size: 2 },
    { name: 'ORD', type: 'C', size: 1 },
    { name: 'ISHOD', type: 'C', size: 3 },
    { name: 'RSLT', type: 'C', size: 3 },
    { name: 'PROG', type: 'C', size: 10 },
    { name: 'TRAVMA', type: 'C', size: 2 },
    { name: 'DS_P', type: 'C', size: 6 },
    { name: 'DS', type: 'C', size: 6 },
    { name: 'DS_S', type: 'C', size: 6 },
    { name: 'DS_O', type: 'C', size: 6 },
    { name: 'VMPAP_ID', type: 'C', size: 36 },
    { name: 'CHD', type: 'D', size: 8 },
  ];

  const records = list.map((item) => {
    const {
      PATIENT, C_I, T_CI, ISHOD, RSLT, SRC,  H_TYP, DS_P, MB_STAT, PROG, DORD_N, AP_ID, VMPAP_ID
    } = item;

    return {
      PATIENT: `${PATIENT}`,
      C_I: `${C_I}`,
      T_CI,
      MB_STAT,
      DORD_N: DORD_N ? DORD_N : '',
      AP_ID: AP_ID ? AP_ID : '',
      H_TYP,
      SRC: SRC ? '1' : '10',
      ORD: '4',
      ISHOD,
      RSLT,
      PROG,
      TRAVMA: '',
      DS_P,
      DS: DS_P,
      DS_S: '',
      DS_0: '',
      VMPAP_ID: VMPAP_ID ? VMPAP_ID : '',
      CHD: new Date(),
    };
  });

  return ['MB', fieldDescriptors, records]
};
