'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const schema = require('./assets/products.schema');

const products = (custom) => new Object({
  title: custom.title || tools.random(),
  product_type: custom.product_type || tools.random()
});

suite.forElement('ecommerce', 'products', products({}), schema, (test) => {
  test.should.supportCruds();
});
