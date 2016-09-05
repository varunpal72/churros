'use strict';

const suite = require('core/suite');
const payload = require('./assets/return-authorizations');

suite.forElement('finance', 'return-authorizations', { payload: payload }, (test) => {
  	test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
  	test.should.supportCeqlSearch('id');
});
