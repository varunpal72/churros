'use strict';

const suite = require('core/suite');

suite.forElement('messaging', 'ping', null, (test) => {
	test.should.return200OnGet();
});
