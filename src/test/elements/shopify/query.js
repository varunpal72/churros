'use strict';

const tester = require('core/tester');
const schema = require('./assets/customers.schema');

tester.forElement('ecommerce', 'query', null, schema, (suite) => {
  suite.withOptions({ qs: { q: 'select * from customers' } }).should.return200OnGet();
  suite.withOptions({ qs: { q: 'select id, email from customers' } }).should.return200OnGet();
});
