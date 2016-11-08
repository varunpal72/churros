'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

suite.forElement('finance', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('email');
});