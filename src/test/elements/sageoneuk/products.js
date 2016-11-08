'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const chakram = require('chakram');

suite.forElement('sageaccounting', 'products', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'search =\'product\'' } }).should.return200OnGet();
});