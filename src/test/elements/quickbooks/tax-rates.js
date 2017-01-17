'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'tax-rates', null, (test) => {
  test.should.supportSr();
});
