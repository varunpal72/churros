'use strict';

const suite = require('core/suite');
const payload = require('./assets/invoices');

suite.forElement('finance', 'invoices', { payload: payload }, (test) => {
  	test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
  	test.should.supportCeqlSearch('id');
});
