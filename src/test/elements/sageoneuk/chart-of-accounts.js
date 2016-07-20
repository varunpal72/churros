'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'chart-of-accounts', null, (test) => {
  test.withApi(`${test.api}/structure`).should.return200OnGet();
  test.withApi(`${test.api}/template`).should.return200OnGet();
  let options = { qs: { page: 1, pageSize: 1 } };
  test.withOptions(options).withApi(`${test.api}/structure`).should.return200OnGet();
  test.withOptions(options).withApi(`${test.api}/template`).should.return200OnGet();
});