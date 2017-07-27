'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

suite.forElement('payment', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withApi(test.api).withOptions({ qs: { where: `created >= 1480633070` } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
