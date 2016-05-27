'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'reports', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'type=\'regular\'' } }).should.return200OnGet();
});
