'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'reports', (test) => {
  test.should.return200OnGet();
  it.skip(`should allow GET for /hubs/general/reports/{id}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}`));
  });
  it.skip(`should allow GET for /hubs/general/report/{id}/entries`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/entries`));
  });
  it.skip(`should allow GET for /hubs/general/reports/{id}/entries-count`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/entries-count`));
  });
  it.skip(`should allow GET for /hubs/general/reports/{id}/fields`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/fields`));
  });
  it.skip(`should allow GET for /hubs/general/reports/{id}/widgets`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/widgets`));
  });
  test.should.supportPagination();
});
