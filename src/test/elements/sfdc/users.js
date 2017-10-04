'use strict';

//dependencies at the top
const suite = require('core/suite');
const tools = require('core/tools');
//how to import payloads
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);

suite.forElement('crm', 'users', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.should.supportPagination();
  test.should.return404OnGet('0');//should not find user with id of '0'
});
