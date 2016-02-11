'use strict';

const suite = require('core/suite');
const schema = require('./assets/customers.schema');

suite.forElement('ecommerce', 'query', null, schema, (test) => {
  test.withOptions({ qs: { q: 'select * from customers' } }).should.return200OnGet();
  test.withOptions({ qs: { q: 'select id, email from customers' } }).should.return200OnGet();
});
