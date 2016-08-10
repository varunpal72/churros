'use strict';

const suite = require('core/suite');
const job = require('./assets/job');

suite.forPlatform('jobs', {payload: job}, (test) => {
  test.should.supportCrds();
});
