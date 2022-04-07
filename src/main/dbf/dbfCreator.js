import { DBFFile } from 'dbffile';

export default async (name, descriptors, records) => {
    const dbf = await DBFFile.create(`C:/Users/User/Desktop/Мегаклиника/${name}.dbf`, descriptors, { encoding: 'cp866' });
    console.log(`${name} DBF file created`);
    await dbf.appendRecords(records);
    console.log(`${records.length} records added.`);
}