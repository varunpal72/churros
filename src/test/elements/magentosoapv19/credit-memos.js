'use strict';

const suite = require('core/suite');


suite.forElement('ecommerce', 'credit-memos', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-06-18 14:09:07\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-06-18 14:09:07\'', pageSize: 5, page: 1 } }).should.return200OnGet();
});
