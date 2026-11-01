// @ts-check
import ExcelJS from 'exceljs';
import path from 'path';
import translations from './locales/ru.json';
import { format } from 'date-fns'

const sheetBuilder = async (vmp, ksg, workbook, i18) => {
  const translation  = Object.keys(translations);
  i18.setLocale('ru')
  
  const vmpKeys = Object.keys(vmp[Object.keys(vmp)[0]]).filter((key) => translation.includes(key));
  const ksgKeys = Object.keys(ksg[Object.keys(ksg)[0]]).filter((key) => translation.includes(key));
  console.log(ksgKeys)

  const vmpColumns = vmpKeys.map((key) => ({ name: i18.__(key), filterButton: true }));
  const ksgColumns = ksgKeys.map((key) => ({ name: i18.__(key), filterButton: true }));

  const ksgRows = Object.keys(ksg).reduce((acc, item) => {
    const values = Object.keys(ksg[item]).filter((item) => translation.includes(item)).map((key) => ksg[item][key]);
    acc.push(values);
    return acc;
  }, [])
  const vmpRows = Object.keys(vmp).reduce((acc, item) => {
    const values = Object.keys(vmp[item]).filter((item) => translation.includes(item)).map((key) => vmp[item][key]);
    acc.push(values);
    return acc;
  }, []);
  console.log(vmpRows, vmpColumns)
  const worksheet = workbook.addWorksheet('ВМП');
  worksheet.headerFooter.differentFirst = true;
  worksheet.headerFooter.firstHeader = 'VMP';
  worksheet.addTable({
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    displayName: 'medgroup',
    columns: vmpColumns,
    rows: vmpRows,
  });

  const worksheetKsg = workbook.addWorksheet('КСГ');
  worksheetKsg.headerFooter.differentFirst = true;
  worksheetKsg.headerFooter.firstHeader = 'КСГ';
  worksheetKsg.addTable({
    name: 'MyTable2',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    displayName: 'medgroup',
    columns: ksgColumns,
    rows: ksgRows,
  });
};

export default async (vmp, ksg, i18) => {
  const workbook = new ExcelJS.Workbook();
  sheetBuilder(vmp, ksg, workbook, i18);
  await workbook
    .xlsx
    .writeFile(path.join(`C:/Users/User/Desktop/Выгрузка ФФОМС/`, `ФФОМС.xlsx`))
    .then(() => {
      console.log('saved');
    })
    .catch((err) => {
      console.log('err', err);
    });
};


// path.join(`\\\\172.16.11.205\\PlanGosp\\Света\\`, `ФФОМС ${format(new Date(), 'dd-MM-yy----ds')}.xlsx`)

//path.join(`C:/Users/User/Desktop/Выгрузка ФФОМС/`, `ФФОМС.xlsx`)