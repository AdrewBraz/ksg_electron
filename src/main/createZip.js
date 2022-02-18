import createXml from './xml/createXml';
import AdmZip from 'adm-zip';
import { format } from 'date-fns';
import fs from 'fs';

export default async (xml) => {
    const zip = new AdmZip();
    const date = format(new Date(), 'yyyy-MM-dd');
    await createXml(xml, date);
    const [year, month, day ] = date.split('-')
    const stat = fs.statSync(`C:/Users/User/Desktop/Выгрузка ФФОМС/${year}_${month}_990089_${day}.xml`);
    console.log(stat)
    const add = await zip.addLocalFile(`C:/Users/User/Desktop/Выгрузка ФФОМС/${year}_${month}_990089_${day}.xml`);
    console.log(add)
    await zip.writeZip(`C:/Users/User/Desktop/Выгрузка ФФОМС/FM990089F00${date}.zip`);
    return true
}