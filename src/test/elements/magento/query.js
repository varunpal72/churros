'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'bulk/query', null, (test) => {
  test.withOptions({ qs: { q: 'select * from customers' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select id, email from customers' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select * from orders' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select id, grand_total from orders' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select * from products' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select name, price from products' } }).should.return200OnPost();
});
