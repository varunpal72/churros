'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/employees');

payload.lastName += tools.random();
payload.title += tools.random();

suite.forElement('finance', 'employees', { payload: payload }, (test) => {
  	test.should.supportCruds();
	  test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
  	test.should.supportCeqlSearch('id');
});
