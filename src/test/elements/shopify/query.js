'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'query', (test) => {
  test.withName('should allow querying for customers').withOptions({ qs: { q: 'select * from customers' } }).should.return200OnGet();
  test.withName('should allow querying for customers id and email').withOptions({ qs: { q: 'select id, email from customers' } }).should.return200OnGet();
});
