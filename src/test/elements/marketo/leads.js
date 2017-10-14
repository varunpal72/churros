'use strict';

const suite = require('core/suite');
const leadsPayload = require('./assets/leads');
const programsPayload = require('./assets/programs');

suite.forElement('marketing', 'programs', { payload: programsPayload }, (test) => {
  it('should allow C for programs/{programId}/leads', () => {
    let programId;
    leadsPayload.email = "sampleTestName" + tools.random() + "@test.com";
    return cloud.post(test.api, payload)
      .then(r => programId = r.body.id)
      .then(r => cloud.post(`${test.api}/${programId}/leads`, leadsPayload()))
      .then(r => cloud.delete(`${test.api}/${programId}`));
  });
});


