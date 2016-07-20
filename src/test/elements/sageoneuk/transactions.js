'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'transactions', null, (test) => {
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'updated_from_date=\'2016-06-30\'' } }).should.return200OnGet();
});