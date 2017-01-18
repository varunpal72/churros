'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'abandoned-checkouts', null, (test) => {
   test.should.return200OnGet();
});
