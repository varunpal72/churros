'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/products');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ name: tools.random() });

suite.forElement('ecommerce', 'products', { payload: productsPayload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'type = \'simple\'' } }).should.return200OnGet();
});
