'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

suite.forElement('finance', 'customers', { payload: payload, skip: false}, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('familyName');
});
