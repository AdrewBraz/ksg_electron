import {
    getRslt, getIshod, getProfil, getPrev,
  } from './xml/utils';

export default (data) => {
    data.map(item => {
        const {
            PATIENT, FIO, USL_OK, C_T, C_I, DR, W, PATOLOGY, S_POL, SN_POL, ORG_CODE, ORG, DDS, F_C_KSLP, AGE, IN_DATE, OUT_DATE, TAL_D, TAL_NUM, FINAL_CODE, ID, F_MES_CODE, F_MES_NAME, F_KSG_NUM, F_MES_SUMM, F_CR_MKB_CODE2, F_CR_SERVICE_CODE
        } = item;
        let SNPOLIS = SN_POL;
        let ENP;
        const calculateDays = Math.round((OUT_DATE.getTime() - IN_DATE.getTime()) / (24 * 3600 * 1000));
        const DAYS = USL_OK === 1 ? calculateDays : (Math.floor(calculateDays) + 1);
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
        const ISHOD = getIshod(RSLT);
        return {
            kz: 
        }
    })
}