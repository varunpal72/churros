'use strict';

const suite = require('core/suite');
const payload = require('./assets/deals');

suite.forElement('crm', 'deals', { payload: payload }, (test) => {
  // need to get correct contactId first
  test.withOptions({skip:true}).should.supportCrus();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('LastName');
});
