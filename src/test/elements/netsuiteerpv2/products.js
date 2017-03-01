'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const tools = require('core/tools');
payload.itemId += tools.randomInt();

suite.forElement('erp', 'products', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
