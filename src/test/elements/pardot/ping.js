'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'ping', (test) => { 
     test.should.return200OnGet();
});
