'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'tax-rates', { skip: false }, (test) => {
  test.should.supportSr();
});
