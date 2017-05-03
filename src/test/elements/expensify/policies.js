'use strict';

const suite = require('core/suite');
const payload = require('./assets/policies');

suite.forElement('payment', 'policies', { payload: payload }, (test) => {
  test.should.supportCrs();
  test.should.supportPagination();
});
