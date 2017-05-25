'use strict';

const suite = require('core/suite');
const payload = require('./assets/expenses');

suite.forElement('payment', 'expenses', { payload: payload }, (test) => {
  test.should.return200OnPost();
});
