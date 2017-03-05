'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'countries', (test) => {
  test.should.supportSr();
});
