'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'reports', (test) => {
  test.should.return200OnGet();
  it(`should allow GET for /hubs/general/reports/{id}`, () => {
    let reportId;
    return cloud.get(`${test.api}`)
      .then(r => reportId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${reportId}`));
  });
  it(`should allow GET for /hubs/general/report/{id}/entries`, () => {
    let reportId;
    return cloud.get(`${test.api}`)
      .then(r => reportId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${reportId}/entries`));
  });
  it(`should allow GET for /hubs/general/reports/{id}/entries-count`, () => {
    let reportId;
    return cloud.get(`${test.api}`)
      .then(r => reportId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${reportId}/entries-count`));
  });
  it(`should allow GET for /hubs/general/reports/{id}/fields`, () => {
    let reportId;
    return cloud.get(`${test.api}`)
      .then(r => reportId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${reportId}/fields`));
  });
  it(`should allow GET for /hubs/general/reports/{id}/widgets`, () => {
    let reportId;
    return cloud.get(`${test.api}`)
      .then(r => reportId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${reportId}/widgets`));
  });
  test.should.supportPagination();
});
