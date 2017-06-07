'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'transaction-summaries', (test) => {
	test.withOptions({ qs: { fields: 'period,account,item'}}).should.return200OnGet();
});
