'use strict';

const suite = require('core/suite');


suite.forElement('ecommerce', 'orders', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-04-23 23:27:45\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-04-23 23:27:45\'', pageSize: 5, page: 1} }).should.return200OnGet();

});
