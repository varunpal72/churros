'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-04-24 11:19:25\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-04-24 11:19:25\'', pageSize: 5, page: 1} }).should.return200OnGet();

});
