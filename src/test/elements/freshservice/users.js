'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);

suite.forElement('helpdesk', 'users', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});