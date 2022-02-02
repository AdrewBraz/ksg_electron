import { create, fragment } from 'xmlbuilder2';
import {
  format, getMonth, getDate, lastDayOfMonth,
} from 'date-fns';
import { utf8_decode } from './utils';

function makeCounter() {
  let currentCount = 1;

  return {
    getNext() {
      return currentCount++;
    },

  };
}

export default (coll) => {
  const { ksgList, vmpList } = coll;
  const counter = makeCounter();
  const root = create({ encoding: 'windows-1251', standalone: true })
    .ele('ZL_LIST')
    .ele('ZGLV')
      .ele('VERSION').txt('1.0').up()
      .ele('DATA').txt(`${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`).up()
      .ele('FILENAME').txt(`2022_01_990089_005.xml`).up()
      .ele('SD_Z').txt(Object.values(ksgList).length + Object.values(vmpList).length).up()
    .up()
    .ele('OTPR')
      .ele('CODE_MO').txt(990089).up()
      .ele('YEAR').txt(2022).up()
      .ele('MONTH').txt(1).up()
    .ele('DAY').txt(31).up()
    .up();

  Object.values(vmpList).forEach((item) => {
    const adr = utf8_decode(item.ADR_NAME);
    const frag = fragment()
      .ele('N_ZAP').txt(counter.getNext()).up()
      .ele('TYPE').txt('PRIL4').up()
      .ele('PACIENT').up()
      .ele('NPR').ele('IDNPR').txt(`${item.IDNPR}`).up()
        .ele('TAL_D').txt(format(item.TAL_D, 'yyyy-MM-dd')).up()
        .ele('TAL_NUM').txt(`${item.TAL_NUM}`).up()
        .ele('NPR_MO').txt(772209).up()
        .ele('POVOD').txt(item.POVOD).up()
        .ele('DS1').txt(`${item.DS1}`).up()
        .ele('USL_OK').txt(`${item.USL_OK}`).up()
        .ele('VIDPOM').txt(item.VIDPOM).up()
        .ele('FOR_POM').txt(item.FOR_POM).up()
        .ele('PROFIL').txt(item.PROFIL).up()
        .ele('GR_HMP').txt(`${item.GR_HMP}`).up()
        .ele('VID_HMP').txt(`${item.VID_HMP}`).up()
        .ele('RESH_HMP').txt(1).up()
        .ele('PODR').txt(`${item.PODR}`).up()
        .ele('PODR_NAME').txt(`${item.PODR_NAME}`).up()
        .ele('PROFIL_K').txt(67).up()
        .ele('TAL_P').txt(format(item.DATE_Z_1, 'yyyy-MM-dd')).up()
      .up()
      .ele('Z_SL')
        .ele('IDCASE').txt(`${item.IDCASE}`).up()
        .ele('ADR_GAR').txt(`${item.ADR_GAR}`).up()
        .ele('ADR_NAME').txt('121552, г. Москва, город Москва, УЛИЦА ЧЕРЕПКОВСКАЯ 3-Я, ДОМ 15А').up()
        .ele('USL_OK').txt(`${item.USL_OK}`).up()
        .ele('VIDPOM').txt(item.VIDPOM).up()
        .ele('FOR_POM').txt(item.FOR_POM).up()
        .ele('DATE_Z_1').txt(format(item.DATE_Z_1, 'yyyy-MM-dd')).up()
        .ele('DATE_Z_2').txt(format(item.DATE_Z_2, 'yyyy-MM-dd')).up()
        .ele('KD_Z').txt(item.KD_Z).up()
        .ele('RSLT').txt(`${item.RSLT}`).up()
        .ele('ISHOD').txt(`${item.ISHOD}`).up()
        .ele('IS_PRERV').txt(`${item.IS_PRERV}`).up()
        .ele('SL')
          .ele('SL_ID').txt(`${item.IDCASE}`).up()
          .ele('PODR').txt(`${item.PODR}`).up()
          .ele('PODR_NAME').txt(`${item.PODR_NAME}`).up()
          .ele('PROFIL').txt(item.PROFIL).up()
          .ele('PROFIL_K').txt(67).up()
          .ele('NHISTORY').txt(`${item.C_I}`).up()
          .ele('DS_GR').txt(`${item.DS1}`).up()
          .ele('DS1').txt(`${item.DS1}`).up()
          .ele('GR_HMP').txt(`${item.GR_HMP}`).up()
          .ele('VID_HMP').txt(`${item.VID_HMP}`).up()
          .ele('METOD_HMP').txt(`${item.METOD_HMP}`).up()
          .ele('MODEL_HMP').txt(`${item.MODEL_HMP}`).up()
          .ele('LECH_HMP').txt(1).up()
          .ele('DZP').txt(`${item.DZP}`).up()
          .ele('NFZ').txt(`${item.NFZ}`).up()
          .ele('TARIF').txt(`${item.SUMV}`).up()
          .ele('COMENTSL').txt(`"Загружено из МИС"`).up()
        .up()
      .up();

    root.ele('ZAP').import(frag);
    const { ENP, SNPOLIS } = item;
    if (ENP) {
      const fragPol = fragment()
        .ele('ENP').txt(`${ENP}`).up()
        .ele('SMO_OK').txt('').up()
        .ele('SMO').txt('').up()
        .ele('W').txt(`${item.W}`).up()
        .ele('DR').txt(format(item.DR, 'yyyy-MM-dd')).up()
        .ele('NOVOR').txt(0).up()
        .ele('FAM').txt('').up()
        .ele('IM').txt('').up()
        .ele('OT').txt('').up()
        .ele('DOST').txt('').up()
        .ele('TEL').txt('').up()
        .ele('MR').txt('').up()
        .ele('DOCTYPE').txt('').up()
        .ele('DOCSER').txt('').up()
        .ele('DOCNUM').txt('').up()
        .ele('DOCDATE').txt('').up()
        .ele('DOCORG').txt('').up()
        .ele('SNILS').txt('').up()
        .ele('OKATOG').txt('').up()
        .ele('OKATOP').txt('').up()
        .ele('COMENTP').txt('').up()
        .ele('FAM_P').txt('').up()
        .ele('IM_P').txt('').up()
        .ele('OT_P').txt('').up()
        .ele('W_P').txt('').up()
        .ele('DR_P').txt('').up()
        .ele('DOST_P').txt('').up()
      root.last().first().next().next()
        .import(fragPol);
    }
    if (SNPOLIS) {
      const fragPol = fragment()
        .ele('SNPOLIS').txt(`${SNPOLIS}`).up()
        .ele('SMO_OK').txt('').up()
        .ele('SMO').txt('').up()
        .ele('W').txt(`${item.W}`).up()
        .ele('DR').txt(format(item.DR, 'yyyy-MM-dd')).up()
        .ele('NOVOR').txt(0).up()
        .ele('FAM').txt('').up()
        .ele('IM').txt('').up()
        .ele('OT').txt('').up()
        .ele('DOST').txt('').up()
        .ele('TEL').txt('').up()
        .ele('MR').txt('').up()
        .ele('DOCTYPE').txt('').up()
        .ele('DOCSER').txt('').up()
        .ele('DOCNUM').txt('').up()
        .ele('DOCDATE').txt('').up()
        .ele('DOCORG').txt('').up()
        .ele('SNILS').txt('').up()
        .ele('OKATOG').txt('').up()
        .ele('OKATOP').txt('').up()
        .ele('COMENTP').txt('').up()
        .ele('FAM_P').txt('').up()
        .ele('IM_P').txt('').up()
        .ele('OT_P').txt('').up()
        .ele('W_P').txt('').up()
        .ele('DR_P').txt('').up()
        .ele('DOST_P').txt('').up()
      root.last().first().next().next()
        .import(fragPol);
    }
  });
  Object.values(ksgList).forEach((item) => {
    const {
      ENP, SNPOLIS, F_CR_SERVICE_CODE, SL_K, F_C_KSLP, F_CR_MKB_CODE2,
    } = item;
    console.log(item)
    const frag = fragment()
    .ele('N_ZAP').txt(counter.getNext()).up()
    .ele('TYPE').txt('PRIL4').up()
    .ele('PACIENT').up()
    .ele('NPR').ele('IDNPR').txt(`${item.IDNPR}`).up()
      .ele('TAL_D').txt(format(item.TAL_D, 'yyyy-MM-dd')).up()
      .ele('TAL_NUM').txt(`${item.TAL_NUM}`).up()
      .ele('NPR_MO').txt(772209).up()
      .ele('POVOD').txt(item.POVOD).up()
      .ele('DS1').txt(`${item.DS1}`).up()
      .ele('USL_OK').txt(`${item.USL_OK}`).up()
      .ele('VIDPOM').txt(item.VIDPOM).up()
      .ele('FOR_POM').txt(item.FOR_POM).up()
      .ele('PROFIL').txt(item.PROFIL).up()
      .ele('PODR').txt(`${item.PODR}`).up()
      .ele('PODR_NAME').txt(`${item.PODR_NAME}`).up()
      .ele('PROFIL_K').txt(`${item.PROFIL_K}`).up()
      .ele('TAL_P').txt(format(item.DATE_Z_1, 'yyyy-MM-dd')).up()
    .up()
      .ele('Z_SL')
        .ele('IDCASE').txt(`${item.IDCASE}`).up()
        .ele('ADR_GAR').txt(`${item.ADR_GAR}`).up()
        .ele('ADR_NAME').txt('121552, г. Москва, город Москва, УЛИЦА ЧЕРЕПКОВСКАЯ 3-Я, ДОМ 15А').up()
        .ele('USL_OK').txt(`${item.USL_OK}`).up()
        .ele('VIDPOM').txt(item.VIDPOM).up()
        .ele('FOR_POM').txt(item.FOR_POM).up()
        .ele('DATE_Z_1').txt(format(item.DATE_Z_1, 'yyyy-MM-dd')).up()
        .ele('DATE_Z_2').txt(format(item.DATE_Z_2, 'yyyy-MM-dd')).up()
        .ele('KD_Z').txt(item.KD_Z).up()
        .ele('RSLT').txt(`${item.RSLT}`).up()
        .ele('ISHOD').txt(`${item.ISHOD}`).up()
        .ele('IS_PRERV').txt(`${item.IS_PRERV}`).up()
        .ele('KOEF_PRERV').txt(`${item.KOEF_PRERV}`).up()
        .ele('KOEF_PRIV').txt(`${item.KOEF_PRIV}`).up()
        .ele('KOEF_SPEC').txt(`${item.KOEF_SPEC}`).up()
        .ele('KOEF_D').txt(`${item.KOEF_D}`).up()
        .ele('SRED_NFZ').txt(`${item.SRED_NFZ}`).up()
        .ele('SL')
          .ele('SL_ID').txt(`${item.IDCASE}`).up()
          .ele('PODR').txt(`${item.PODR}`).up()
          .ele('PODR_NAME').txt(`${item.PODR_NAME}`).up()
          .ele('PROFIL').txt(item.PROFIL).up()
          .ele('PROFIL_K').txt(`${item.PROFIL_K}`).up()
          .ele('NHISTORY').txt(`${item.C_I}`).up()
          .ele('DS_GR').txt(`${item.DS1}`).up()
          .ele('DS1').txt(`${item.DS1}`).up()
          .ele('DS2').txt(`${F_CR_MKB_CODE2 ? F_CR_MKB_CODE2 : ''}`).up()
          .ele('KSG_KPG')
            .ele('N_KSG').txt(`${item.F_MES_CODE}`).up()
            .ele('GR').txt(``).up()
            .ele('VER_KSG').txt(`${item.VER_KSG}`).up()
            .ele('KOEF_Z').txt(`${item.KOEF_Z}`).up()
            .ele('SL_K').txt(`${item.SL_K}`).up()
            .ele('IT_SL').txt(`${item.F_C_KSLP}`).up()
          .up()
          .ele('DZP').txt(1).up()
          .ele('TARIF').txt(`${item.SUMV}`).up()
        .up()
        .ele('SUMV').txt(`${item.SUMV}`).up()
      .up()

    root.ele('ZAP').import(frag);
    if (F_CR_SERVICE_CODE) {
      const fragUsl = fragment()
        .ele('USL')
          .ele('IDSERV').txt(`1`).up()
          .ele('VID_VME').txt(`${item.F_CR_SERVICE_CODE}`).up()
        .up()
        .ele('COMENTSL').txt(`"Загружено из МИС"`).up()
      root.last().last().last().prev().import(fragUsl);
    }
    if (SL_K === 1) {
      const IDSL = F_C_KSLP === 0.2 ? 1 : 8;
      const fragKSLP = fragment()
        .ele('SL_KOEF')
          .ele('IDSL').txt(`${IDSL}`).up()
          .ele('Z_SL').txt(F_C_KSLP).up()
        .up();
      if (F_CR_SERVICE_CODE) {
        root.last().last().last().prev().last().prev().prev().prev().prev().import(fragKSLP);
      } else {
        root.last().last().last().prev().last().prev().prev().import(fragKSLP);
      }
    }
    if (ENP) {
      const fragPol = fragment()
        .ele('ENP').txt(`${ENP}`).up()
        .ele('SMO_OK').txt('').up()
        .ele('SMO').txt('').up()
        .ele('W').txt(`${item.W}`).up()
        .ele('DR').txt(format(item.DR, 'yyyy-MM-dd')).up()
        .ele('NOVOR').txt(0).up()
        .ele('FAM').txt('').up()
        .ele('IM').txt('').up()
        .ele('OT').txt('').up()
        .ele('DOST').txt('').up()
        .ele('TEL').txt('').up()
        .ele('MR').txt('').up()
        .ele('DOCTYPE').txt('').up()
        .ele('DOCSER').txt('').up()
        .ele('DOCNUM').txt('').up()
        .ele('DOCDATE').txt('').up()
        .ele('DOCORG').txt('').up()
        .ele('SNILS').txt('').up()
        .ele('OKATOG').txt('').up()
        .ele('OKATOP').txt('').up()
        .ele('COMENTP').txt('').up()
        .ele('FAM_P').txt('').up()
        .ele('IM_P').txt('').up()
        .ele('OT_P').txt('').up()
        .ele('W_P').txt('').up()
        .ele('DR_P').txt('').up()
        .ele('DOST_P').txt('').up()
      root.last().first().next().next().import(fragPol);
    }
    if (SNPOLIS) {
      const fragPol = fragment()
        .ele('SNPOLIS').txt(`${SNPOLIS}`).up()
        .ele('SMO_OK').txt('').up()
        .ele('SMO').txt('').up()
        .ele('W').txt(`${item.W}`).up()
        .ele('DR').txt(format(item.DR, 'yyyy-MM-dd')).up()
        .ele('NOVOR').txt(0).up()
        .ele('FAM').txt('').up()
        .ele('IM').txt('').up()
        .ele('OT').txt('').up()
        .ele('DOST').txt('').up()
        .ele('TEL').txt('').up()
        .ele('MR').txt('').up()
        .ele('DOCTYPE').txt('').up()
        .ele('DOCSER').txt('').up()
        .ele('DOCNUM').txt('').up()
        .ele('DOCDATE').txt('').up()
        .ele('DOCORG').txt('').up()
        .ele('SNILS').txt('').up()
        .ele('OKATOG').txt('').up()
        .ele('OKATOP').txt('').up()
        .ele('COMENTP').txt('').up()
        .ele('FAM_P').txt('').up()
        .ele('IM_P').txt('').up()
        .ele('OT_P').txt('').up()
        .ele('W_P').txt('').up()
        .ele('DR_P').txt('').up()
        .ele('DOST_P').txt('').up()
      root.last().first().next().next().import(fragPol);
    }
    // if (F_CR_MKB_CODE2) {
    //   const fragDS2 = fragment().ele('DS2').txt(`${F_CR_MKB_CODE2}`).up();
    //   root.last().last().last().prev().first().next().next().next().next().next().next().next().import(fragDS2);
    // }
  });
  root
    .ele('SIGNATURE')
      .ele('CANONMETALG').txt('').up()
      .ele('SIGNMETALG').txt('').up()
      .ele('REFERENCE').txt('').up()
      .ele('KEYINFO').txt('').up()
      .ele('SIGN').txt('').up()
    .up()
  const xml = root.end({ prettyPrint: true });
  return xml;
};