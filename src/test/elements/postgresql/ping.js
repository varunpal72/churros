'use strict';

const suite = require('core/suite');

suite.forElement('db', 'ping',null, (test) => { 
     test.should.return200OnGet();
});
