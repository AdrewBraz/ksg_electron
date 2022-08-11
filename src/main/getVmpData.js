import { getRslt, getIshod } from './xml/utils';
import { DayCalculation } from './utils/utils.js'

const vHmp = [{
  GROUP: 42, COD: '200530', VID_HMP: 183, METOD_HMP: 44, MODEL_HMP: 21168, DZP: 0.47, NAME: "баллонная вазодилатация с установкой 1 - 3 стентов в сосуд (сосуды)", NFS: 167220, PRICE: 222471.16  
}, {
  GROUP: 36, COD: '200518', VID_HMP: 183, METOD_HMP: 47, MODEL_HMP: 21166, DZP: 0.56, NAME: "баллонная вазодилатация с установкой 1 стента в сосуд (сосуды)", NFS: 172649, PRICE: 240617.46  
}, {
  GROUP: 37, COD: '200519', VID_HMP: 183, METOD_HMP: 46, MODEL_HMP: 21166, DZP: 0.49, NAME: "баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)", NFS: 200591, PRICE: 269688.58  
}, {
  GROUP: 38, COD: '200520', VID_HMP: 183, METOD_HMP: 45, MODEL_HMP: 21166, DZP: 0.43, NAME: "баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)", NFS: 228440, PRICE: 297495.13
}, {
  GROUP: 39, COD: '200522', VID_HMP: 183, METOD_HMP: 47, MODEL_HMP: 21167, DZP: 0.54, NAME: "баллонная вазодилатация с установкой 1 стента в сосуд (сосуды)", NFS: 128489, PRICE: 177265.99
}, {
  GROUP: 40, COD: '200523', VID_HMP: 183, METOD_HMP: 46, MODEL_HMP: 21167, DZP: 0.45, NAME: "баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)", NFS: 156482, PRICE: 205985.08 
}, {
  GROUP: 41, COD: '200524', VID_HMP: 183, METOD_HMP: 45, MODEL_HMP: 21167, DZP: 0.34, NAME: "баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)", NFS: 196645, PRICE: 243647.09
}, {
  GROUP: 44, COD: '200409', VID_HMP: 220, METOD_HMP: 1103, MODEL_HMP: 21169, DZP: 0.17, NAME: "имплантация частотноадаптированного однокамерного кардиостимулятора", NFS: 152912, PRICE: 171186.51
}, {
  GROUP: 46, COD: '200510', VID_HMP: 219, METOD_HMP: 1102, MODEL_HMP: 21170, DZP: 0.37, NAME: "имплантация частотноадаптированного двухкамерного кардиостимулятора", NFS: 225385, PRICE: 284009.89
}, {
  GROUP: 48, COD: '200525', VID_HMP: 184, METOD_HMP: 1072, MODEL_HMP: 21171, DZP: 0.52, NAME: "аортокоронарное шунтирование у больных ишемической болезнью сердца в условиях искусственного кровоснабжения", NFS: 387407, PRICE: 529027.5
},
{
  GROUP: 43, COD: '200570', VID_HMP: 471, METOD_HMP: 2601, MODEL_HMP: 22207, DZP: 0.24, NAME: "баллонная вазодилятация и/или стентирование с установкой 1-3 стентов в сосуд с применением методов внутрисосудистой визуализации и/или в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца", NFS: 330593, PRICE: 386370.65 
},
{
  GROUP: 65, COD: '200065', VID_HMP: 471, METOD_HMP: 2601, MODEL_HMP: 22207, DZP: 0.24, NAME: "Создание фенестраций при эндоваскулярном протезировании аорты с сохранением кровотока по ветвям дуги аорты", NFS: 330593, PRICE: 1574111 
},
{
  GROUP: 66, COD: '200066', VID_HMP: 471, METOD_HMP: 2601, MODEL_HMP: 22207, DZP: 0.24, NAME: "Имплантация фенестрированного стент-графта при эндопротезирование брюш. аорты с сохран. кровотока по висцел. арт.", NFS: 330593, PRICE: 3242579 
},
];

export default async (data) => {
  const result = data.reduce((acc, item) => {
    const {
      PATIENT, FIO, C_I, S_POL, SN_POL, DDS, IN_DATE, OUT_DATE, FINAL_CODE, ID, JSON_DATA
    } = item;
    const obj = vHmp.find((el) => el.COD === (item.COD).toString());
    const { VID_HMP, METOD_HMP, MODEL_HMP, DZP, GROUP, PRICE, NAME, NFS } = obj;
    const hmp = vHmp.find((el) => el.GROUP === GROUP);
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
    const [FAM, IM, OT ] = FIO.split(' ')
    const RSLT = getRslt(FINAL_CODE);
    const ISHOD = getIshod(RSLT);
    acc[C_I] = {
      IDNPR: `${PATIENT}_${ID}`,
      SNPOLIS,
      FAM,
      IM,
      OT: OT ? OT : '',
      ENP,
      POVOD: 3,
      C_I,
      DS1: DDS,
      USL_OK: 1,
      VIDPOM: 32,
      FOR_POM: 3,
      PROFIL: 81,
      GR_HMP: GROUP,
      VID_HMP,
      METOD_HMP,
      MODEL_HMP,
      DZP,
      NFZ: NFS,
      RESH_HMP: 1,
      IDCASE: `${PATIENT}_${C_I}`,
      ADR_GAR: '92cbcc75-02b2-4a74-ac33-cc2fcdac25bc',
      ADR_NAME: '121552, г. Москва, ул. 3-я Черепковская, д. 15А, стр. 3',
      DATE_Z_1: IN_DATE,
      DATE_Z_2: OUT_DATE,
      KD_Z: DayCalculation(IN_DATE, OUT_DATE),
      RSLT,
      ISHOD,
      IS_PRERV: 0,
      SUMV: PRICE,
      NAME,
      ...item
    };
    return acc;
  }, {});
  return result;
};
