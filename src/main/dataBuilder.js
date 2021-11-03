import { uniqBy } from 'lodash';
import { listDsController, listUslController } from './controller';
import { listDsController as dailyDsList, listUslController as dailyUslList } from './controller/ds';
import { getRatio, calculateKsg, calculateKslp } from './ksg';
import {
  getRslt, getIshod, getProfil, getPrev,
} from './xml/utils';

export default async (data) => {
  const dsList = uniqBy(data, 'DDS');
  const usList = uniqBy(data, 'SRV_CODE');
  const filteredList = dsList.map((item) => item.DDS).filter((item) => item !== 'U07.1' && item !== 'U07.2');
  const filteredListUSl = usList.map((item) => item.SRV_CODE).filter((item) => !!item).map((item) => item.trim());
  const hospDs = await listDsController(filteredList);
  const hospUsl = await listUslController(filteredListUSl);
  const dailyDs = await dailyDsList(filteredList);
  const dailyUsl = await dailyUslList(filteredListUSl);
  const result = data.reduce((acc, item) => {
    const {
      PATIENT, USL_OK, C_T, C_I, PATOLOGY, S_POL, SN_POL, DDS, AGE, IN_DATE, OUT_DATE, TAL_D, TAL_NUM, ID, FINAL_CODE
    } = item;
    let SNPOLIS;
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
    const cod = item.SRV_CODE ? item.SRV_CODE : '';
    const kslp = calculateKslp(AGE, PATOLOGY, DAYS);
    const RSLT = getRslt(FINAL_CODE, USL_OK);
    const {
      ratio, ksg, ksgName, group,
    } = USL_OK === 1 ? getRatio(DDS, hospDs, cod, DAYS, hospUsl, USL_OK) : getRatio(DDS, dailyDs, cod, DAYS, dailyUsl, USL_OK);
    if (acc[C_I]) {
      const { SUMV: total } = acc[C_I];
      const { KOEF_SPEC, SUMV } = calculateKsg(ratio, AGE, FINAL_CODE, PATOLOGY, DAYS, USL_OK)
      if (total < SUMV) {
        acc[C_I].KOEF_Z = ratio;
        acc[C_I].KOEF_SPEC = KOEF_SPEC;
        acc[C_I].N_KSG = ksg;
        acc[C_I].GR = group;
        acc[C_I].PROFIL = getProfil(group);
        acc[C_I].cod = cod;
        acc[C_I].ksgName = ksgName;
        acc[C_I].PROFIL_K = getProfil(group) === 81 ? 67 : 26;
        acc[C_I].SUMV = SUMV;
        acc[C_I].total = SUMV;
      }
    } else {
      const { SRED_NFZ, KOEF_D, KOEF_PRIV, KOEF_PRERV, KOEF_SPEC, SUMV } = calculateKsg(ratio, AGE, FINAL_CODE, PATOLOGY, DAYS, USL_OK)
      console.log(SUMV, C_I)
      acc[C_I] = {
        KOEF_Z: ratio,
        IDNPR: `${PATIENT}_${ID}`,
        ENP,
        SNPOLIS,
        AGE,
        TAL_D,
        TAL_NUM,
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
      };
    }
    return acc;
  }, {});
  return result;
};
