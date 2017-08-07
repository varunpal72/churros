'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const job = require('./assets/job');

suite.forPlatform('jobs', {payload: job}, (test) => {
  it(`should allow CRDS for ${test.api}`, () => cloud.get('/jobs')
  .then(r => r.body.map(obj => obj.id))
  .then(r => Promise.all(r.map(id => cloud.delete(`/jobs/${id}`, () => {}))))
  .then(() => cloud.crds(test.api, job)));
});
