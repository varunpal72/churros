'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'products', null, (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { page: 1, pageSize: 1}}).should.return200OnGet();
});
