'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const productsCategoriesPayload = () => ({
  "name":tools.random()
});

suite.forElement('ecommerce', 'products-categories', { payload: productsCategoriesPayload() }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Clothing\'' } }).should.return200OnGet();
});
