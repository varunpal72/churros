'use strict';

const suite = require('core/suite');

suite.forElement('messaging', 'ping', {}, (test) => {
	test.should.return200OnGet();;
});
