'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/background-checks');

suite.forElement('screening', 'background-checks', { payload: payload }, (test) => {

  test.should.return200OnPost();

  it('should allow GET for /hubs/screening/background-checks/{id}/reports and /hubs/screening/background-checks/{id}/statuses', () => {
    let backgroundCheckId = payload.clientApplicantId + ":" + payload.clientRequestId;
    return cloud.post('/hubs/screening/background-checks', payload)
      .then(r => cloud.get(`/hubs/screening/background-checks/${backgroundCheckId}/reports`))
      .then(r => cloud.get(`/hubs/screening/background-checks/${backgroundCheckId}/statuses`));
  });

});
