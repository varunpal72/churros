'use strict';

const suite = require('core/suite');

suite.forElement('billing', 'plans', (test) => {
  test.should.supportSr(); //not testing deleting as you can't delete a created plan
  test.should.supportNextPagePagination(2);
  test.withOptions({ qs: { where: `begin_time = '2017-04-10T16:02:04Z' and state = 'open'` } }).should.return200OnGet();
  test.withOptions({ qs: { orderBy: 'updated_at asc', pageSize: 5 } }).should.return200OnGet();
});
