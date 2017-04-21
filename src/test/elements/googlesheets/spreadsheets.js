'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('general', 'spreadsheets', (test) => {

  it.skip('should allow GET for spreadsheets', () => {
    let spreadsheetId;
    let worksheetId, versionId;
    let rowPayload = {'gsx:sal': '2', 'gsx:ipm': '1', 'gsx:items': '15','sx:name': 'AVC' };
    let rowUpdatePayload ={'gsx:sal': '2', 'gsx:ipm': '1', 'gsx:items': '15','sx:name': 'AVC' };
    let rowId;
    let spreadSheetPayload = { 'title': 'New Sheet'+tools.random(),'gs:rowCount': '881','gs:colCount': '15' };

    return cloud.get(test.api)
      .then(r => spreadsheetId = r.body[0].spreadsheetId)
      .then(r => cloud.get(`${test.api}/${spreadsheetId}/worksheets`))
      .then(r => {
        worksheetId = r.body[0].worksheetId;
        versionId = r.body[0].versionId;
      })
      .then(r => cloud.get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}`))
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}?versionId=${versionId}`))
      .then(r => cloud.get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/rows`))
      .then(r => cloud.withOptions({ qs: { where: 'updated=\'2017-04-04T13:19:26.127Z\'', orderBy: 'updated' } }).get(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/rows`));
      .then(r =>.post(`${test.api}/${spreadsheetId}/worksheet`,spreadSheetPayload))
      .then(r => { worksheetId = r.body[0].worksheetId;
                  versionId = r.body[0].versionId;
            })
      .then(r => cloud.post(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row`),rowPayload)
      .then(r => rowId = r.body[0].versionId)
      .then(r => cloud.put(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row/{rowId}`),rowUpdatePayload)
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}/row/{rowId}?versionId=${versionId}`))
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheet/${worksheetId}?versionId=${versionId}`));
  });
});
