const getRslt = (code, usl_ok = 1) => {
  const types = {
    V: '101',
    3: '102',
    0: '101',
    5: '105',
    9: '108',
    null: '101',
    1: '107',
    7: '101',
  };

  const dsTypes = {
    3: '202',
    0: '201',
    5: '205',
    9: '208',
    null: '201',
    1: '207',
    7: '201',
  };

  return usl_ok === 1 ? types[code] : dsTypes[code];
};

const getIshod = (rslt) => {
  const types = {
    101: '102',
    102: '103',
    105: '104',
    108: '102',
    107: '102',
    201: '202',
    202: '203',
    205: '204',
    208: '202',
    207: '202',
  };
  return types[rslt];
};

const getPrev = (final, days, group = '') => {
  if (final === '108') {
    return 1;
  }
  if (final === '208') {
    return 1;
  }
  if (group === 235) {
    return 0;
  }
  if (days <= 3) {
    return 1;
  }
  return 0;
};

const getProfil = (group) => {
  if (['st25.001', 'st25.002', 'st25.003', 'st25.004', 'st25.005', 'st25.006', 'st25.007', 'st25.008', 'st25.009', 'st25.010', 'st25.011', 'st25.012', 'ds25.001', 'ds25.002', 'ds25.003' ].includes(group) === true) {
    return 81;
  } if ([ 'st13.001', 'st13.002', 'st13.003', 'st13.004','st13.005' ,'st13.006' ,'st13.007' ,'st13.008' ,'st13.009' ,'st13.010', 'ds13.001' ,'ds13.002' ,'ds13.003', 'ds36.017', 'ds36.018', 'ds36.019'].includes(group) === true) {
    return 29;
  } if (['st27.005', 'st27.006', 'st27.007', 'st27.008', 'st27.009'].includes(group)) {
    return 97;
  }
  return 77;
};

const utf8_decode = (aa) => {
  let bb = ''; let
    c = 0;
  for (let i = 0; i < aa.length; i++) {
    c = aa.charCodeAt(i);
    if (c > 127) {
      if (c > 1024) {
        if (c == 1025) {
          c = 1016;
        } else if (c == 1105) {
          c = 1032;
        }
        bb += String.fromCharCode(c - 848);
      }
    } else {
      bb += aa.charAt(i);
    }
  }
  return bb;
};

export {
  getRslt, getIshod, getProfil, utf8_decode, getPrev,
};
