'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const workSheetPayload = tools.requirePayload(`${__dirname}/assets/worksheets.json`);

suite.forElement('general', 'spreadsheets', (test) => {
  let spreadsheetId;
  let worksheetId;

  it('should allow CRD for /spreadsheets/worksheets', () => {
    let versionId;
    return cloud.get(test.api)
      .then(r => spreadsheetId = r.body[0].spreadsheetId)
      .then(r => cloud.post(`${test.api}/${spreadsheetId}/worksheet`, workSheetPayload))
      .then(r => {
        worksheetId = r.body.worksheetId;
        versionId = r.body.versionId;
      })
      .then(r => cloud.get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}`))
      .then(r => cloud.withOptions({ qs: { versionId: versionId } }).delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}`));
  });

  it('should allow CRUD for /spreadsheets/worksheets/rows', () => {
    // Hardcoded worksheetId and spreadsheetId as the rowPayload keys should match the worksheet header values
    spreadsheetId = '1-dx_xl6COXSGpXsuoNhMc0KGuEkMnazBXqjSr4SyT5U';
    worksheetId = 'ohgdgle';
    let rowVersionId;
    let rowId;
    let rowPayload = tools.requirePayload(`${__dirname}/assets/rows.json`);

    return cloud.get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/rows`)
      .then(r => cloud.withOptions({ qs: { where: 'updated=\'2017-04-04T13:19:26.127Z\'', orderBy: 'updated' } }).get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/rows`))
      .then(r => cloud.post(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row`, rowPayload))
      .then(r => {
        rowId = r.body.rowId;
        rowVersionId = r.body.versionId;
        rowPayload["gsx:name"] = tools.random();
      })
      .then(r => cloud.withOptions({ qs: { versionId: rowVersionId } }).put(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row/${rowId}`, rowPayload))
      .then(r => cloud.withOptions({ qs: { versionId: rowVersionId } }).delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row/${rowId}`));
  });
});
