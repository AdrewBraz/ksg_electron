import { DBFFile } from 'dbffile';
import fs from 'fs/promises';
import path from 'path';

export default async function writeDbfSet(directory, tables) {
  await fs.mkdir(directory, { recursive: true });
  const stage = await fs.mkdtemp(path.join(directory, '.export-'));
  const backup = path.join(stage, 'previous');
  const saved = [];
  const installed = [];
  let removeStage = true;
  try {
    await fs.mkdir(backup);
    for (const [name, fields, records] of tables) {
      const dbf = await DBFFile.create(path.join(stage, name + '.dbf'), fields, { encoding: 'cp866' });
      await dbf.appendRecords(records);
    }
    for (const [name] of tables) {
      const file = name + '.dbf';
      try {
        await fs.rename(path.join(directory, file), path.join(backup, file));
        saved.push(file);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      await fs.rename(path.join(stage, file), path.join(directory, file));
      installed.push(file);
    }
  } catch (error) {
    removeStage = false;
    for (const file of installed) await fs.unlink(path.join(directory, file));
    for (const file of saved) await fs.rename(path.join(backup, file), path.join(directory, file));
    removeStage = true;
    throw error;
  } finally {
    if (removeStage) await fs.rm(stage, { recursive: true, force: true });
  }
}
