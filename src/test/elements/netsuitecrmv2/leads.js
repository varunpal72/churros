'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const cloud = require('core/cloud');

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  test.should.supportEvents(payload, 'leads', 'netsuitecrmv2', `${__dirname}/assets/scripts.js`)
  // test.should.supportCruds();
  // test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  // test.should.supportCeqlSearch('id');
});
