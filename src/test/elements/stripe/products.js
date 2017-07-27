'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = tools.requirePayload(`${__dirname}/assets/products.json`);

suite.forElement('payment', 'products', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withApi(test.api).withOptions({ qs: { where: `active='true'` } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
