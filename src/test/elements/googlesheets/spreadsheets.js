'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('general', 'spreadsheets', (test) => {
  let spreadsheetId;
  let worksheetId;

  it('should allow CRD for /spreadsheets/worksheets', () => {
    let versionId;
    let workSheetPayload = { 'title': 'New Sheet' + tools.random(), 'gs:rowCount': '881', 'gs:colCount': '15' };
    return cloud.get(test.api)
      .then(r => spreadsheetId = r.body[0].spreadsheetId)
      .then(r => cloud.post(`${test.api}/${spreadsheetId}/worksheet`, workSheetPayload))
      .then(r => {
        worksheetId = r.body.worksheetId;
        versionId = r.body.versionId;
      })
      .then(r => cloud.get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}`))
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}?versionId=${versionId}`));
  });

  it('should allow CRUD for /spreadsheets/worksheets/rows', () => {
    // Hardcoded worksheetId and spreadsheetId as the rowPayload keys should match the worksheet header values
    spreadsheetId = '1-dx_xl6COXSGpXsuoNhMc0KGuEkMnazBXqjSr4SyT5U';
    worksheetId = 'ohgdgle';
    let rowVersionId;
    let rowPayload = { 'gsx:sal': '2', 'gsx:ipm': '1', 'gsx:items': '15', 'gsx:name': 'AVC' };
    let rowUpdatePayload = { 'gsx:sal': '10', 'gsx:ipm': '1', 'gsx:items': '15', 'gsx:name': 'ZYZ' + tools.random() };
    let rowId;
    return cloud.get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/rows`)
      .then(r => cloud.withOptions({ qs: { where: 'updated=\'2017-04-04T13:19:26.127Z\'', orderBy: 'updated' } }).get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/rows`))
      .then(r => cloud.post(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row`, rowPayload))
      .then(r => {
        rowId = r.body.rowId;
        rowVersionId = r.body.versionId;
      })
      .then(r => cloud.put(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row/${rowId}?versionId=${rowVersionId}`, rowUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row/${rowId}?versionId=${rowVersionId}`));
  });
});
