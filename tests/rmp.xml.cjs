const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { create, fragment } = require('xmlbuilder2');
const { format } = require('date-fns');

// Load the existing ES module without changing the application's Babel configuration.
const source = fs.readFileSync(path.join(__dirname, '../src/main/xml/rmp.js'), 'utf8')
  .replace(/import[\s\S]*?from\s+'[^']+';/g, '')
  .replace('export default', 'module.exports =');
const context = { create, fragment, format, utf8_decode: x => x, module: {}, console: { log() {} } };
vm.runInNewContext(source, context);
const base = {
  TAL_D: new Date(2026, 0, 1), DATE_Z_1: new Date(2026, 0, 1), DATE_Z_2: new Date(2026, 0, 2),
  KD_Z: 1, RSLT: '208', ISHOD: '202', IS_PRERV: 1, PR_PR: '8', F_KSG_NUM: '100',
  F_CR_PARAM_CODE: null, F_CR_MKB_CODE2: null, SL_K: 0,
};
function generate(fields) {
  return context.module.exports({ksgList: [{...base, ...fields}], vmpList: []});
}
for (const diagnosis of [null, undefined, '', '   ', ' E11 ']) {
  for (const criterion of [null, 'gsh011']) {
    test(`DS2 diagnosis=${JSON.stringify(diagnosis)}, criterion=${criterion}`, () => {
      const xml = generate({F_CR_MKB_CODE2: diagnosis, F_CR_PARAM_CODE: criterion});
      assert.equal(xml.includes('<DS2>E11</DS2>'), diagnosis === ' E11 ');
      if (diagnosis !== ' E11 ') assert.ok(!xml.includes('<DS2'));
    });
  }
}
for (const group of [424, '424']) {
  for (const criterion of [null, 'gsh011', 'gsh999', 'other']) {
    for (const service of [null, 'service']) {
      test(`group=${group} (${typeof group}), criterion=${criterion}, service=${service}`, () => {
        const xml = generate({F_KSG_NUM: group, F_CR_PARAM_CODE: criterion, F_CR_SERVICE_CODE: service, SL_K: 1, F_C_KSLP: '0.20'});
        assert.ok(xml.includes('<IS_PRERV>0</IS_PRERV>'));
        assert.ok(xml.includes('<PR_PR/>'));
        assert.ok(xml.includes('<REGNUM>03033</REGNUM>'));
        assert.ok(xml.includes('<DOSE_INJ>284</DOSE_INJ>'));
        const doc = create(xml).node;
        const coefficients = doc.getElementsByTagName('SL_KOEF');
        assert.equal(coefficients.length, 1);
        assert.equal(coefficients[0].parentNode.nodeName, 'KSG_KPG');
        assert.equal(doc.getElementsByTagName('LEK_PR').length, 1);
      });
    }
  }
}
for (const [criterion, registration, dose] of [['gsh011','000079',300], ['gsh999','002382',140]]) {
  test(`existing medication ${criterion}`, () => {
    const xml = generate({F_CR_PARAM_CODE: criterion});
    assert.ok(xml.includes(`<REGNUM>${registration}</REGNUM>`));
    assert.ok(xml.includes(`<DOSE_INJ>${dose}</DOSE_INJ>`));
    assert.ok(xml.includes('<IS_PRERV>1</IS_PRERV>'));
    assert.ok(xml.includes('<PR_PR>8</PR_PR>'));
  });
}
for (const fields of [{F_KSG_NUM:258}, {F_KSG_NUM:'258'}, {RSLT:'201',ISHOD:'202'}, {RSLT:201,ISHOD:202}]) {
  test(`previous interruption rule ${JSON.stringify(fields)}`, () => {
    const xml = generate(fields);
    assert.ok(xml.includes('<IS_PRERV>0</IS_PRERV>'));
    assert.ok(xml.includes('<PR_PR/>'));
    assert.ok(!xml.includes('<LEK_PR>'));
  });
}
test('other outcome preserves interruption values', () => {
  const xml = generate({RSLT:'201',ISHOD:'203'});
  assert.ok(xml.includes('<IS_PRERV>1</IS_PRERV>'));
  assert.ok(xml.includes('<PR_PR>8</PR_PR>'));
});
