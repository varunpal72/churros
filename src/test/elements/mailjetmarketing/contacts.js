'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
	test.should.supportPagination();
	test.withOptions({ skip: true }).should.supportCrus();
});
