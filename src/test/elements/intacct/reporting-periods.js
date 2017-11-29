'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'reporting-periods', null , (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'WHENCREATED>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
