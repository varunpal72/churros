'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/background-checks');

suite.forElement('screening', 'background-checks', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  let backgroundCheckId = payload.clientApplicantId + ":" + payload.clientRequestId;

  it('should allow creating a background-check', () => {
    return cloud.post('/hubs/screening/background-checks', payload);
  })

  it('should allow retrieving a background-check report and status', () => {
    return cloud.post('/hubs/screening/background-checks', payload)
      .then(r => cloud.get(`/hubs/screening/background-checks/${backgroundCheckId}/reports`))
      .then(r => cloud.get(`/hubs/screening/background-checks/${backgroundCheckId}/statuses`));
  });

});
