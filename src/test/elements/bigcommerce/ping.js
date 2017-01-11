'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'ping',null, (test) => { 
     test.should.return200OnGet();
});
