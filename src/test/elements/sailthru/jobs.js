'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/jobs');
//Adding skip as there is no delete
suite.forElement('marketing', 'jobs', { payload: payload, skip: true }, (test) => {
  it('should support POST /jobs and GET /jobs/:id', () => {
    let jobId;
    return cloud.post(test.api, payload)
      .then(r => jobId = r.body.id)
      .then(r => cloud.get(`${test.api}/${jobId}`));
  });
});
