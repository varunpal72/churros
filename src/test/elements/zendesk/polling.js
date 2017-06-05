'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const usersPayload = tools.requirePayload(`${__dirname}/assets/users.json`);

suite.forElement('helpdesk', 'polling', null, (test) => {
  test.withApi('/hubs/helpdesk/users').should.supportPolling(usersPayload, 'users');
});
