//@ts-check
export default (list) => {
  const fieldDescriptors = [
    { name: 'PATIENT', type: 'C', size: 36 },
    { name: 'S_PASP', type: 'C', size: 16 },
    { name: 'SN_PASP', type: 'C', size: 16 },
    { name: 'Q_PASP', type: 'C', size: 2 },
    { name: 'DAT_DUL', type: 'D', size: 8 },
    { name: 'CHD', type: 'D', size: 8 },
  ];

  const records = list.map((item) => {
    const {
      PATIENT, S_PASP, SN_PASP, Q_PASP, DAT_DUL,
    } = item;
    return {
      PATIENT: `${PATIENT}`,
      S_PASP: S_PASP ? `${S_PASP}` : '',
      SN_PASP: SN_PASP ? `${SN_PASP}` : '',
      Q_PASP: Q_PASP ? `${Q_PASP}` : '',
      DAT_DUL,
      CHD: new Date(),
    };
  });

  return ['DU', fieldDescriptors, records]
};
