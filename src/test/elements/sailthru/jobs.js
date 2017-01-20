'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/jobs');

suite.forElement('marketing', 'jobs', { payload: payload }, (test) => {

  it('should support POST /jobs and GET /jobs:id for jobs', () => {
    let jobId;
    return cloud.post(test.api, payload)
      .then(r => jobId = r.body.id)
      .then(r => cloud.get(`${test.api}/${jobId}`));
  });
});
