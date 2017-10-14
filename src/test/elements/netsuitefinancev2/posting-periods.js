'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'posting-periods', (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'periodName=\'Feb 2002\'' } }).should.return200OnGet();
});
