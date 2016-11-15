'use strict';

const suite = require('core/suite');
const payload = require('./assets/forms');
const cloud = require('core/cloud');

suite.forElement('general', 'forms', { payload: payload }, (test) => {
  test.should.return200OnGet();
  it.skip(`should allow GET for /hubs/general/forms/{id}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}`));
  });
  it.skip(`should allow GET for /hubs/general/forms/{id}/comments`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/comments`));
  });
  it.skip(`should allow GET for /hubs/general/forms/{id}/comments-count`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/comments-count`));
  });
  it.skip(`should allow GET for /hubs/general/forms/{id}/entries`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/entries`));
  });
  it.skip(`should allow GET for /hubs/general/forms/{id}/entries-count`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/entries-count`));
  });
  it.skip(`should allow GET for /hubs/general/forms/{id}/fields`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/fields`));
  });
  it.skip(`should allow POST for /hubs/general/forms/{id}/entries`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.post(`${test.api}/${r.body[0].Hash}/entries`, payload));
  });
  test.should.supportPagination();
});
