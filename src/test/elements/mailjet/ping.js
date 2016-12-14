'use strict';

const suite = require('core/suite');

suite.forElement('messaging', 'ping', {skip: true}, (test) => {
	test.should.return200OnGet();
});
