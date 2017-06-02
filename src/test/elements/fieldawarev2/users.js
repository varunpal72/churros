'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/users');

payload.email = tools.randomEmail();
payload.firstName = tools.random();

suite.forElement('fsa', 'users', { payload: payload }, (test) => {
  	test.should.supportCruds();
    test.should.supportPagination();
  	test.should.supportCeqlSearch('firstName');
});
