'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-rates');

suite.forElement('sageaccounting', 'tax-rates', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});