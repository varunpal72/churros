'use strict';

const suite = require('core/suite');

suite.forElement('expense', 'expense-group-configurations', null, (test) => {
  test.should.supportSr();
});
