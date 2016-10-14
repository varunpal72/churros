'use strict';

const suite = require('core/suite');

suite.forElement('messaging', 'usage', {}, (test) => {
	test.withOptions({ qs: { days: 99 }}).should.return200OnGet();
});
