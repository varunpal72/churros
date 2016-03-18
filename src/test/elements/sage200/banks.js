'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'banks', null, (test) => {
  test.should.supportPagination();
  test.should.return200OnGet();
  test.withOptions({qs: {where: 'code=\'1200\''}}).should.return200OnGet();
});
