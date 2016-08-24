'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'customers', (test) => {
  test.should.supportSr();
});
