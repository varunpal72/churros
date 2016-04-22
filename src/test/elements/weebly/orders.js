'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'orders', { payload: {} }, (test) => {
  test.should.supportPagination();
  test.should.return200OnGet();
});
