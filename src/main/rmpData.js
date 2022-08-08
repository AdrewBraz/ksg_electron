import {
    getRslt, getIshod, getProfil, getPrev,
  } from './xml/utils';
import { DayCalculation } from './utils/utils.js'

export default (data) => {
    return data.map(item => {
        const {
            PATIENT, FIO, USL_OK, C_T, C_I, PATOLOGY, S_POL, SN_POL,  DDS, F_C_KSLP, AGE, IN_DATE, OUT_DATE, FINAL_CODE, ID, F_MES_CODE, F_MES_SUMM, F_KSG_NUM, F_KZ, F_CDIFF, F_CSPEC, F_CPRIV, F_BASE, F_C_DURATION_CASE,
            F_ZP, JSON_DATA
        } = item;
        if(JSON_DATA){
          console.log(JSON.parse(JSON_DATA).ROWS)
        }
        const [ FAM, IM, OT] = FIO.split(' ')
        const calculateDays = DayCalculation(IN_DATE, OUT_DATE);
        const DAYS = USL_OK === 1 ? calculateDays : (Math.floor(calculateDays) + 1);
        const ADR_GAR = USL_OK === 1 ? '92cbcc75-02b2-4a74-ac33-cc2fcdac25bc' : 'f6549d35-fd39-4f67-b08f-fa9b89bf6119'
        const ADR_NAME = USL_OK === 1 ? '121552, г. Москва, ул. 3-я Черепковская, д. 15А, стр. 3' : '121552, г. Москва, ул. 3-я Черепковская, д. 15А, стр. 5'
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
        console.log(C_I, F_KSG_NUM, getPrev(RSLT, DAYS, F_KSG_NUM))
        return {
            KOEF_Z: F_KZ,
            IDNPR: `${PATIENT}_${ID}`,
            ENP,
            SNPOLIS,
            AGE,
            POVOD: 3,
            FAM,
            IM,
            OT: OT ? OT : '',
            C_I,
            DS1: DDS,
            USL_OK,
            VIDPOM: 31,
            FOR_POM: 3,
            PROFIL: getProfil(F_MES_CODE),
            RESH: 1,
            IDCASE: `${PATIENT}_${C_I}`,
            ADR_GAR,
            ADR_NAME,
            DATE_Z_1: IN_DATE,
            DATE_Z_2: OUT_DATE,
            KD_Z: DAYS,
            RSLT,
            ISHOD,
            IS_PRERV:  getPrev(RSLT, DAYS, F_KSG_NUM),
            VER_KSG: 2022,
            SL_K: getSlk(F_C_KSLP),
            PROFIL_K: getProfil(F_MES_CODE) === 81 ? 67 : 26,
            FINAL_CODE: final,
            SRED_NFZ: F_BASE ? F_BASE : '',
            KOEF_SPEC: F_CSPEC,
            KOEF_PRIV: F_CPRIV,
            KOEF_PRERV: F_C_DURATION_CASE,
            KOEF_D: F_CDIFF,
            SUMV: F_MES_SUMM,
            C_T,
            ...item
        }
    })
}