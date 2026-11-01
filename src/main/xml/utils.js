const getRslt = (code, usl_ok = 1) => {
  const types = {
    V: '101',
    A: '101',
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

const getPR = (rslt) => {
  const types = {
    107: '5',
    105: '6',
    108: '1',
    101: '',
    201: ''
  }
  return types[rslt]
}

const getPodr = (code) => {
  const podrs = {
    200: '1.2.643.5.1.13.13.12.2.77.8486.0.233803',
    202: '1.2.643.5.1.13.13.12.2.77.8486.0.233828',
    204: '1.2.643.5.1.13.13.12.2.77.8486.0.233854',
    206: '1.2.643.5.1.13.13.12.2.77.8486.0.231898',
    207: '1.2.643.5.1.13.13.12.2.77.8486.0.829843',
    208: '1.2.643.5.1.13.13.12.2.77.8486.0.233871',
    209: '1.2.643.5.1.13.13.12.2.77.8486.0.233874',
    210: '1.2.643.5.1.13.13.12.2.77.8486.0.233875',
    314: '1.2.643.5.1.13.13.12.2.77.8486.0.233877',
    213: '1.2.643.5.1.13.13.12.2.77.8486.0.227620',
    321: '1.2.643.5.1.13.13.12.2.77.8486.0.233818',
    363: '1.2.643.5.1.13.13.12.2.77.8486.0.739213'
  };
  return podrs[code];
};

const getPrev = (final, days, group = '') => {
  if (final === '108') {
    return 1;
  }
  else if (final === '105') {
    return 1;
  }
  else if (final === '102') {
    return 1;
  }
  else if (final === '208') {
    return 1;
  }
  else if (group === 'st25.004') {
    return 0;
  }
  else if (group === 'ds36.035') {
    return 0;
  }
  else if (group === 'ds36.020') {
    return 0;
  }
  else if (group === 'ds25.001') {
    return 0;
  }
  else if (group === 'st36.029') {
    return 0;
  }
  else if (days <= 3) {
    return 1;
  }
  return 0;
};

const getProfil = (group) => {
  if (['st25.001', 'st25.002', 'st25.003', 'st25.004', 'st25.005', 'st25.006', 'st25.007', 'st25.008', 'st25.009', 'st25.010', 'st25.011', 'st25.012', 'st25.013', 'st25.014', 'st25.015', 'st25.016', 'st25.017', 'st25.018', 'st25.019', 'st25.020', 'st25.021', 'st25.022', 'ds25.001', 'ds25.002', 'ds25.003' ].includes(group) === true) {
    return 81;
  } if ([ 'st13.001', 'st13.002', 'st13.003', 'st13.004','st13.005' ,'st13.006' ,'st13.007' ,'st13.008' ,'st13.009' ,'st13.010', 'ds13.001' ,'ds13.002' ,'ds13.003', 'ds36.017', 'ds36.018', 'ds36.019', 'ds36.035', 'ds36.027'].includes(group) === true) {
    return 29;
  } if (['st27.005', 'st27.006', 'st27.007', 'st27.008', 'st27.009'].includes(group)) {
    return 97;
  }
  return 77;
};

const getProfil_M = (group) => {
  if (['st25.001', 'st25.002', 'st25.003', 'st25.004', 'st25.005', 'st25.006', 'st25.007', 'st25.008', 'st25.009', 'st25.010', 'st25.011', 'st25.012', 'st25.013', 'st25.014', 'st25.015', 'st25.016', 'st25.017', 'st25.018', 'st25.019', 'st25.020', 'st25.021', 'st25.022', 'ds25.001', 'ds25.002', 'ds25.003' ].includes(group) === true) {
    return 34;
  } if ([ 'st13.001', 'st13.002', 'st13.003', 'st13.004','st13.005' ,'st13.006' ,'st13.007' ,'st13.008' ,'st13.009' ,'st13.010', 'ds13.001' ,'ds13.002' ,'ds13.003', 'ds36.017', 'ds36.018', 'ds36.019', 'ds36.035', 'ds36.027'].includes(group) === true) {
    return 15;
  } if (['st27.005', 'st27.006', 'st27.007', 'st27.008', 'st27.009'].includes(group)) {
    return 37;
  }
  return 33;
};

const getPovod = (group) => {
  if (['st25.001', 'st25.002', 'st25.003', 'st25.004', 'st25.005', 'st25.006', 'st25.007', 'st25.008', 'st25.009', 'st25.010', 'st25.011', 'st25.012', 'st25.013', 'st25.014', 'st25.015', 'st25.016', 'st25.017', 'st25.018', 'st25.019', 'st25.020', 'st25.021', 'st25.022', 'ds25.001', 'ds25.002', 'ds25.003' ].includes(group) === true) {
    return 3;
  } if ([ 'st13.001', 'st13.002', 'st13.003', 'st13.004','st13.005' ,'st13.006' ,'st13.007' ,'st13.008' ,'st13.009' ,'st13.010', 'ds13.001' ,'ds13.002' ,'ds13.003', 'ds36.017', 'ds36.018', 'ds36.019', 'ds36.035', 'ds36.027'].includes(group) === true) {
    return 5;
  } if (['st27.005', 'st27.006', 'st27.007', 'st27.008', 'st27.009'].includes(group)) {
    return 2;
  } if (['ds36.017', 'ds36.018', 'ds36.019', 'ds36.020', 'ds36.021', 'ds36.035'].includes(group) === true) {
    return 6;
  }
}

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
  getRslt, getIshod, getProfil, utf8_decode, getPrev, getPodr, getPovod, getProfil_M, getPR
};
