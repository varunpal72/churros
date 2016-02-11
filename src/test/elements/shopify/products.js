'use strict';

const tester = require('core/tester');
const tools = require('core/tools');
const schema = require('./assets/products.schema');

const products = (custom) => new Object({
  title: custom.title || tools.random(),
  product_type: custom.product_type || tools.random()
});

tester.forElement('ecommerce', 'products', products({}), schema, (test) => {
  test.should.supportCruds();
});
