'use strict';

const suite = require('core/suite');
const payload = require('./assets/discounts');

suite.forElement('ecommerce', 'discounts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
