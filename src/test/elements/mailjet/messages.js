'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');

suite.forElement('messaging', 'messages', { payload: payload, skip: true }, (test) => {
	test.should.return200OnGet();
	test.should.supportPagination();

	it.skip('should suppport create and read', () => {
		// TODO: Blocked by error in element 'Sender field cannot be null'
	});
});
