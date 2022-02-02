import fs from 'fs';
import util from 'util';
import iconv from 'iconv-lite';

const writeFile = util.promisify(fs.writeFile);

export default async (xml, date) => {
  await writeFile(`${__dirname}/file.xml`, xml);
  return new Promise((resolve) => {
    const write = fs.createWriteStream(`C:/Users/User/Desktop/Выгрузка ФФОМС/2022_01_990089_005.xml`);
    const readable = fs.createReadStream(`${__dirname}/file.xml`)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(iconv.encodeStream('win1251'))
      .pipe(write)
      .on('close', () => resolve(`C:/Users/User/Desktop/Выгрузка ФФОМС/2022_01_990089_005.xml created`));
})};
