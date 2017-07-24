'use strict';

const suite = require('core/suite');
const payload = require('./assets/classifications');

suite.forElement('finance', 'classifications', { payload: payload }, (test) => {
  	test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.supportPagination();
  	test.should.supportCeqlSearch('name');
});
