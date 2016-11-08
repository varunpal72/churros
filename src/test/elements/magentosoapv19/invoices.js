'use strict';

const suite = require('core/suite');
const payload = require('./assets/invoices');

suite.forElement('ecommerce', 'invoices', { payload: payload }, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-05-29 08:38:43\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-05-29 08:38:43\'', pageSize: 5, page: 1 } }).should.return200OnGet();
});
