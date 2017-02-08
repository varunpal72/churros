'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const createProduct = () => ({
  "name": tools.random()
});

suite.forElement('payment', 'products', { payload: createProduct() }, (test) => {
  test.should.supportCruds();
  test.withApi(test.api).withOptions({ qs: { where: `active='true'` } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
