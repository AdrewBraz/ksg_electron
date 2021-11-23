// @ts-check
import ExcelJS from 'exceljs';
import path from 'path';
import { findKey } from 'lodash';

const sheetBuilder = async (interinKsg, ksgList, workbook) => {
  
  const ksg = Object.values(ksgList).filter(item =>  findKey(interinKsg, { C_I: item.C_I }))
  const translateInterinKeys = {
    DDS: 'Диагноз',
    C_I: 'ИБ',
    F_KSG_NUM: 'Группа',
    F_CR_SERVICE_CODE: 'Услуга',
    F_MES_NAME: 'Название КСГ',
    F_MES_CODE: 'Код КСГ',
    F_MES_SUMM: 'Cумма',

  };
  const translateKsgKeys = {
    DS1: 'Диагноз',
    C_I: 'ИБ',
    GR: 'Группа',
    cod: 'Услуга',
    ksgName: 'Название КСГ',
    N_KSG: 'Код КСГ',
    SUMV: 'Cумма',
  };

  const vmpIncludeKeys = Object.keys(translateInterinKeys);
  const ksgIncludeKeys = Object.keys(translateKsgKeys);
  const vmpKeys = Object.keys(interinKsg[Object.keys(interinKsg)[0]]).filter((key) => vmpIncludeKeys.includes(key));
  const ksgKeys = Object.keys(ksg[Object.keys(ksg)[0]]).filter((key) => ksgIncludeKeys.includes(key));

  const vmpColumns = vmpKeys.map((key) => ({ name: translateInterinKeys[key], filterButton: true }));
  const ksgColumns = ksgKeys.map((key) => ({ name: translateKsgKeys[key], filterButton: true }));

  const ksgRows = Object.keys(ksg).reduce((acc, item) => {
    const values = Object.keys(ksg[item]).filter((item) => ksgIncludeKeys.includes(item)).map((key) => ksg[item][key]);
    acc.push(values);
    return acc;
  }, []);
  const vmpRows = Object.keys(interinKsg).reduce((acc, item) => {
    const values = Object.keys(interinKsg[item]).filter((item) => vmpIncludeKeys.includes(item)).map((key) => interinKsg[item][key]);
    acc.push(values);
    return acc;
  }, []);
  console.log(ksgColumns)
  const worksheet = workbook.addWorksheet('КСГ');
  worksheet.headerFooter.differentFirst = true;
  worksheet.headerFooter.firstHeader = 'КСГ';
  worksheet.addTable({
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    displayName: 'medgroup',
    columns: vmpColumns,
    rows: vmpRows,
  });
  worksheet.addTable({
    name: 'MyTable2',
    ref: 'K1',
    headerRow: true,
    totalsRow: true,
    displayName: 'medgroup',
    columns: ksgColumns,
    rows: ksgRows,
  });
};

export default async (interinKsg, ksg) => {
  const workbook = new ExcelJS.Workbook();
  sheetBuilder(interinKsg, ksg, workbook);
  await workbook
    .xlsx
    .writeFile(path.join('C:/Users/User/Desktop/Выгрузка ФФОМС/', 'ФФОМС_сравнение.xlsx'))
    .then(() => {
      console.log('saved');
    })
    .catch((err) => {
      console.log('err', err);
    });
};
