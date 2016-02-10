'use strict';

const tester = require('core/tester');
const tools = require('core/tools');
const schema = require('./assets/products.schema');

const products = (custom) => new Object({
  title: custom.title || tools.random(),
  product_type: custom.product_type || tools.random()
});

tester.for('ecommerce', 'products', (api) => {
  tester.it.cruds(api, products({}), schema);
});
