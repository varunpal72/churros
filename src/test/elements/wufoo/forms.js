'use strict';

const suite = require('core/suite');
const payload = require('./assets/forms');
const cloud = require('core/cloud');

suite.forElement('general', 'forms', { payload: payload }, (test) => {
  test.should.return200OnGet();
  it(`should allow GET for /hubs/general/forms/{id}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/comments`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/comments`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/comments-count`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/comments-count`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/entries`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/entries`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/entries-count`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/entries-count`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/fields`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].Hash}/fields`));
  });
  it(`should allow POST for /hubs/general/forms/{id}/entries`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.post(`${test.api}/${r.body[0].Hash}/entries`, payload));
  });
  test.should.supportPagination();
});
