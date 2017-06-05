'use strict';

const suite = require('core/suite');

suite.forElement('expense', 'expense-group-configurations', (test) => {
  test.should.supportSr();
});