import {
    getRslt, getIshod, getProfil, getPrev,
  } from './xml/utils';

export default (data) => {
    return data.map(item => {
        const {
            PATIENT, FIO, USL_OK, C_T, C_I, PATOLOGY, S_POL, SN_POL,  DDS, F_C_KSLP, AGE, IN_DATE, OUT_DATE, FINAL_CODE, ID, F_KSG_NUM, F_KZ, F_CDIFF, F_CSPEC, F_CPRIV, F_BASE, F_C_DURATION_CASE,
            F_ZP
        } = item;
        const calculateDays = Math.round((OUT_DATE.getTime() - IN_DATE.getTime()) / (24 * 3600 * 1000));
        const DAYS = USL_OK === 1 ? calculateDays : (Math.floor(calculateDays) + 1);
        let SNPOLIS; let
      ENP;
    if (S_POL || SN_POL.length !== 16) {
      if (!S_POL) {
        SNPOLIS = `${SN_POL}`;
      } else {
        SNPOLIS = `${S_POL} ${SN_POL}`;
      }
    } else {
      ENP = SN_POL;
    }
        const final = FINAL_CODE || '0';
        const RSLT = getRslt(FINAL_CODE, USL_OK);
        const getSlk = kslp => {
            if(kslp === '1'){
                return 0
            } else if(kslp === '0'){
                return 0
            }
            return 1
        }
        const ISHOD = getIshod(RSLT);
        return {
            KOEF_Z: F_KZ,
            IDNPR: `${PATIENT}_${ID}`,
            ENP,
            SNPOLIS,
            AGE,
            POVOD: 3,
            C_I,
            DS1: DDS,
            USL_OK,
            VIDPOM: 31,
            FOR_POM: 3,
            PROFIL: getProfil(F_KSG_NUM),
            RESH: 1,
            IDCASE: `${PATIENT}_${C_I}`,
            ADR_GAR: '271c73e1-90f9-496f-a023-4c9f02800af2',
            ADR_NAME: '121552, г. Москва, город Москва, УЛИЦА ЧЕРЕПКОВСКАЯ 3-Я, ДОМ 15А',
            DATE_Z_1: IN_DATE,
            DATE_Z_2: OUT_DATE,
            KD_Z: DAYS,
            RSLT,
            ISHOD,
            IS_PRERV: F_KSG_NUM === 235 ? getPrev(RSLT, DAYS, F_KSG_NUM) : getPrev(RSLT, DAYS),
            VER_KSG: 2022,
            SL_K: getSlk(F_C_KSLP),
            PATOLOGY,
            PROFIL_K: getProfil(F_KSG_NUM) === 81 ? 67 : 26,
            FINAL_CODE: final,
            SRED_NFZ: F_BASE ? F_BASE : '',
            KOEF_SPEC: F_CSPEC,
            KOEF_PRIV: F_CPRIV,
            KOEF_PRERV: F_C_DURATION_CASE,
            KOEF_D: F_CDIFF,
            SUMV: '',
            C_T,
            ...item
        }
    })
}