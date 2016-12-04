'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

suite.forElement('erp', 'opportunities', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});