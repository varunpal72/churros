'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/vendors');

suite.forElement('finance', 'vendors', { skip: true, payload: payload }, (test) => {
  payload.companyName = tools.random();
  test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
