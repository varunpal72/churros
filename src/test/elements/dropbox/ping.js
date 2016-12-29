'use strict';

const suite = require('core/suite');

suite.forElement('documents', 'ping', null, (test) => {
   test.should.return200OnGet();
});
