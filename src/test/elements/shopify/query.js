'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'query', null, (test) => {
  test.withOptions({ qs: { q: 'select * from customers' } }).should.return200OnGet();
  test.withOptions({ qs: { q: 'select id, email from customers' } }).should.return200OnGet();
});
