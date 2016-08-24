'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'warehouses', (test) => {
  test.should.supportSr();
});
