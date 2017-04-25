'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);

suite.forElement('crm', 'users', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.should.supportPagination();
  test.should.return404OnGet('0');
});
