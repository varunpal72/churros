'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'warehouses', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});