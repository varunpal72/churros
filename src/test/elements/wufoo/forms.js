'use strict';

const suite = require('core/suite');
const payload = require('./assets/forms');
const cloud = require('core/cloud');

suite.forElement('general', 'forms', { payload: payload }, (test) => {
  test.should.return200OnGet();
  it(`should allow GET for /hubs/general/forms/{id}`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${formId}`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/comments`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${formId}/comments`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/comments-count`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${formId}/comments-count`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/entries`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${formId}/entries`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/entries-count`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${formId}/entries-count`));
  });
  it(`should allow GET for /hubs/general/forms/{id}/fields`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.get(`${test.api}/${formId}/fields`));
  });
  it(`should allow POST for /hubs/general/forms/{id}/entries`, () => {
    let formId;
    return cloud.get(`${test.api}`)
      .then(r => formId = r.body[0].Hash)
      .then(r => cloud.post(`${test.api}/${formId}/entries`, payload));
  });
  test.should.supportPagination();
});
