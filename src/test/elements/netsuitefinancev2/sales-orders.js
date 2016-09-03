'use strict';

const suite = require('core/suite');
const payload = require('./assets/sales-orders');

suite.forElement('finance', 'sales-orders', { payload: payload }, (test) => {
  	test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
  	test.should.supportCeqlSearch('id');
});
