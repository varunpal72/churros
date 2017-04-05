'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'spreadsheets', (test) => {

  it('should allow GET for spreadsheets', () => {
    let spreadsheetId, worksheetId, versionId;
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
  });

});
