'use strict';

const suite = require('core/suite');

suite.forElement('payment', 'events', (test) => {
  test.withOptions({ qs: { where: `created >= 1485256439` } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
