'use strict';

const suite = require('core/suite');
const payload = require('./assets/productsTags');

suite.forElement('ecommerce', 'products-tags', { payload: payload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'context = \'view\'' } }).should.return200OnGet();
});
