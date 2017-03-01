'use strict';

const suite = require('core/suite');

// Skip when admin creds run out 
suite.forElement('collaboration', 'organizations', null, (test) => {
  test.should.supportSr();
});