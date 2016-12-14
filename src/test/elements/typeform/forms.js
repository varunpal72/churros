'use strict';

const suite = require('core/suite');
const payload = require('./assets/forms');
const cloud = require('core/cloud');

suite.forElement('general', 'forms', { payload: payload }, (test) => {
  let urlsPayload;
  it(`should allow CR for /hubs/general/forms`, () => {
    let formId;
    return cloud.post(`${test.api}`, payload)
      .then(r => formId = r.body.id)
      .then(r => urlsPayload = { "form_id": formId })
      .then(r => cloud.get(`${test.api}/${formId}`));
  });

  it(`should allow CRU for /hubs/general/urls`, () => {
    let urlId;
    return cloud.post(`/hubs/general/urls`, urlsPayload)
      .then(r => urlId = r.body.id)
      .then(r => cloud.get(`/hubs/general/urls/${urlId}`))
      .then(r => cloud.put(`/hubs/general/urls/${urlId}`, urlsPayload));
  });
});