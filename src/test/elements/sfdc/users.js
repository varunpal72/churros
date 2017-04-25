'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const tools = require('core/tools');

suite.forElement('crm', 'users', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Username": tools.randomEmail()
      },
      skip: true //can't delete users
    }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.should.return404OnGet('0');
});
