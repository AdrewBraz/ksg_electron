import createXml from './xml/createXml';
import AdmZip from 'adm-zip';
import { format } from 'date-fns';
import fs from 'fs';

export default async (xml) => {
    const zip = new AdmZip();
    const date = format(new Date(), 'yyMMdd');
    await createXml(xml, date);
    const stat = fs.statSync(`C:/Users/User/Desktop/Выгрузка ФФОМС/2022_01_990089_005.xml`);
    console.log(stat)
    const add = await zip.addLocalFile(`C:/Users/User/Desktop/Выгрузка ФФОМС/2022_01_990089_005.xml`);
    console.log(add)
    await zip.writeZip(`C:/Users/User/Desktop/Выгрузка ФФОМС/FM990089F00${date}.zip`);
    return true
}