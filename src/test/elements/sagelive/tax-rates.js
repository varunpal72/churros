'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-rates');

suite.forElement('sage', 'tax-rates', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
