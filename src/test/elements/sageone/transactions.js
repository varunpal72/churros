'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'transactions', null, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'updated_from_date =\'2016-06-01\'' } }).should.return200OnGet();
});
