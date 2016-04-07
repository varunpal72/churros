'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const tools = require('core/tools');
payload.sku = tools.random();

suite.forElement('ecommerce', 'products', payload, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.supportCruds();
  test.should.supportCeqlSearch("sku");
});
