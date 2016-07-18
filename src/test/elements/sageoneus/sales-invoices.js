'use strict';

const suite = require('core/suite');
const payload = require('./assets/sales-invoices');
const chakram = require('chakram');

suite.forElement('accounting', 'sales-invoices', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'updated_or_created_since =\'2016-06-01T10:30:00-04:00\'' } }).should.return200OnGet();
});
