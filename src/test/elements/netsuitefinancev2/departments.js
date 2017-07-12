'use strict';

const suite = require('core/suite');
const payload = require('./assets/departments');

suite.forElement('finance', 'departments', { payload: payload }, (test) => {
  	test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.supportPagination();
  	test.should.supportCeqlSearch('name');
});
