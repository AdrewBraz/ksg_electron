import {
    getRslt, getIshod, getProfil, getPrev,
  } from './xml/utils';

export default (data) => {
    data.map(item => {
        console.log(item)
        const {
            PATIENT, FIO, USL_OK, C_T, C_I, DR, W, PATOLOGY, S_POL, SN_POL, ORG_CODE, ORG, DDS, F_C_KSLP, AGE, IN_DATE, OUT_DATE, TAL_D, TAL_NUM, FINAL_CODE, ID, F_MES_CODE, F_MES_NAME, F_KSG_NUM, F_MES_SUMM, F_CR_MKB_CODE2, F_CR_SERVICE_CODE
        } = item;
        console.log(item)
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
            KOEF_Z: ratio,
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
            PROFIL: getProfil(group),
            RESH: 1,
            IDCASE: `${PATIENT}_${C_I}`,
            ADR_GAR: '271c73e1-90f9-496f-a023-4c9f02800af2',
            ADR_NAME: '121552, г. Москва, город Москва, УЛИЦА ЧЕРЕПКОВСКАЯ 3-Я, ДОМ 15А',
            DATE_Z_1: IN_DATE,
            DATE_Z_2: OUT_DATE,
            KD_Z: DAYS,
            RSLT,
            ISHOD: getIshod(RSLT),
            IS_PRERV: group === 235 ? getPrev(RSLT, DAYS, group) : getPrev(RSLT, DAYS),
            N_KSG: ksg,
            GR: group,
            VER_KSG: 2021,
            SL_K: kslp === 1 ? 0 : 1,
            kslp,
            cod,
            PATOLOGY,
            PROFIL_K: getProfil(group) === 81 ? 67 : 26,
            FINAL_CODE,
            ksgName,
            SRED_NFZ,
            KOEF_SPEC,
            KOEF_PRIV,
            KOEF_PRERV,
            KOEF_D,
            SUMV,
            C_T,
            ...item
        }
    })
}