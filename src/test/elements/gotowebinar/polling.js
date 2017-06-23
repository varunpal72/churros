'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const meetingsPayload = require('./assets/meetings');

suite.forElement('conferencing', 'polling', (test) => {
  test.withApi('/hubs/conferencing/meetings').should.supportPolling(meetingsPayload, 'meetings');
});
