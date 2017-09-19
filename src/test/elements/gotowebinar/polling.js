'use strict';

const suite = require('core/suite');
const meetingsPayload = require('./assets/meetings');

suite.forElement('conferencing', 'polling', (test) => {
  test.withApi('/hubs/conferencing/meetings').should.supportPolling(meetingsPayload, 'meetings');
});
