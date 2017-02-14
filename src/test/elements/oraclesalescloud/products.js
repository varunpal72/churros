'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

suite.forElement('crm', 'products', { payload: payload }, (test) => {
  test.withOptions({skip:false}).should.supportCrus();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('SalesProfileStatus');
});
