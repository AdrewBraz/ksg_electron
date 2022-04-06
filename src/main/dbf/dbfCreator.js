import { DBFFile } from 'dbffile';
import { async } from 'regenerator-runtime';

export default async (name, descriptors, records) => {
    const dbf = await DBFFile.create('C:/Users/User/Desktop/Мегаклиника/AD.dbf', fieldDescriptors, { encoding: 'cp866' });
    console.log(`${name} DBF file created`);
    await dbf.appendRecords(records);
    console.log(`${records.length} records added.`);
}