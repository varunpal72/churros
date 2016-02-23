'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'bulk/query', null, (test) => {
  test.withOptions({ qs: { q: 'select * from customers' } }).should.return200OnPost();
});

