'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const tools = require('core/tools');

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  test.withOptions({ churros: { updatePayload: { title: tools.random() } } }).should.supportCruds();
  test.should.supportPagination();
});
