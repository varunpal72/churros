'use strict';

const suite = require('core/suite');
const payload = require('./assets/transactions');

suite.forElement('billing', 'transactions', { payload: payload }, (test) => {
  test.should.supportCrs(); //not testing deleting as you can't delete a created transaction
  test.should.supportNextPagePagination(2);
  test.withOptions({ qs: { where: `begin_time = '2017-04-10T16:02:04Z' and state = 'successful'` } }).should.return200OnGet();
  test.withOptions({ qs: { orderBy: 'updated_at asc', pageSize: 5 } }).should.return200OnGet();
});
