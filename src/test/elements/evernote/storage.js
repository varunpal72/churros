'use strict';

const suite = require('core/suite');

suite.forElement('documents', 'storage', (test) => {
   test.should.return200OnGet();
});
