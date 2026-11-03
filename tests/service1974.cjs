const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { DBFFile } = require('dbffile');

require('@babel/register')({
  babelrc: false, configFile: false, cache: false,
  plugins: ['@babel/plugin-transform-modules-commonjs'],
});
const build = require('../src/main/dbf').default;
const write = require('../src/main/dbf/dbfCreator').default;
const { validate1974Links } = require('../src/main/dbf/service1974');

test('1974 references the existing outpatient card and writes the discharge day and final diagnosis', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'dbf-1974-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const person = { PATIENT: '17' };
  const outpatient = { ...person, C_I: 'AK-42' };
  const tables = {
    PO: [{ ...person, SN_POL: '0000000000000017', DATE_N: new Date('2026-01-01') }],
    PA: [{ ...person, FAM: 'Тест', IM: 'Тест', DR: new Date('1980-01-01'), W: '1' }],
    AD: [person], DU: [person], MB: [{ ...outpatient, DS_P: 'I10', DS: 'I25.1' }],
    MU: [{ ...outpatient, SRV_ID: 130340, DS: 'I10', D_U: new Date('2026-09-20'), K_U: 1 }],
  };
  const services = [{ ...outpatient, DS: 'I25.1', SERVICE_DAY: '2026-09-30', COD_U: '456' }];
  validate1974Links(services, tables);
  for (const name of ['PO', 'PA', 'AD', 'DU', 'MB']) {
    assert.throws(() => validate1974Links(services, { ...tables, [name]: [] }), new RegExp(name));
  }
  assert.throws(() => validate1974Links([{ ...services[0], DS: '' }], tables), /диагноз/);
  await write(directory, Object.keys(tables).map(name => build[name](tables[name], services)));
  async function read(name) {
    const dbf = await DBFFile.open(path.join(directory, name + '.dbf'), { encoding: 'cp866' });
    return dbf.readRecords(dbf.recordCount);
  }
  const [ordinary, added] = await read('MU');
  assert.equal(ordinary.COD, '35002');
  assert.equal(added.COD, '1974');
  assert.equal(added.K_U, 1);
  assert.equal(added.DS, 'I25.1');
  assert.equal(added.D_U.toISOString().slice(0, 10), '2026-09-30');
  const [card] = await read('MB');
  assert.equal(added.C_I, card.C_I);
  for (const name of ['PO', 'PA', 'AD', 'DU', 'MB']) {
    assert.equal((await read(name))[0].PATIENT, added.PATIENT);
  }
});
