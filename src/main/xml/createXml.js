import fs from 'fs';
import util from 'util';
import iconv from 'iconv-lite';

const writeFile = util.promisify(fs.writeFile);

export default async (xml, date) => {
  await writeFile(`${__dirname}/file.xml`, xml);
  const [year, month, day ] = date.split('-')
  return new Promise((resolve) => {
    const write = fs.createWriteStream(`C:/Users/User/Desktop/Выгрузка ФФОМС/${year}_${month}_990089_${day}.xml`);
    const readable = fs.createReadStream(`${__dirname}/file.xml`)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(iconv.encodeStream('win1251'))
      .pipe(write)
      .on('close', () => resolve(`C:/Users/User/Desktop/Выгрузка ФФОМС/${year}_${month}_990089_${day}.xml created`));
})};
