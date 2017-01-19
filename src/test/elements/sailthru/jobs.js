'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/jobs');

suite.forElement('marketing', 'jobs', { payload: payload }, (test) => {

  it('should support POST /jobss and GET /jobss:id for jobs', () => {
    let jobId;
    return cloud.post(test.api, payload)
      .then(r => jobId = r.body.job_id)
      .then(r => cloud.get(`${test.api}/${jobId}`));
  });
});
