'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const chakram = require('chakram');

suite.forElement('sageaccounting', 'products', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'updated_or_created_since =\'2016-06-01\'' } }).should.return200OnGet();
});
