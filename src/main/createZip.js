import createXml from './xml/createXml';
import AdmZip from 'adm-zip';

export default async (xml) => {
    const zip = new AdmZip();
    const date = format(new Date(), 'yyMMdd');
    await createXml(xml, date);
    const stat = fs.statSync(`C:/Users/User/Desktop/Выгрузка ФФОМС//FM990089F00${date}.xml`);
    console.log(stat)
    const add = await zip.addLocalFile(`C:/Users/User/Desktop/Выгрузка ФФОМС//FM990089F00${date}.xml`);
    console.log(add)
    await zip.writeZip(`C:/Users/User/Desktop/Выгрузка ФФОМС/FM990089F00${date}.zip`);
    return true
}