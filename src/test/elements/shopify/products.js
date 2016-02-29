'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const products = (custom) => ({
  title: custom.title || tools.random(),
  product_type: custom.product_type || tools.random()
});

suite.forElement('ecommerce', 'products', products({}), (test) => {
  test.should.supportCruds();
});
