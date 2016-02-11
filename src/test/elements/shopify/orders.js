'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const schema = require('./assets/orders.schema');

const order = (custom) => new Object({
  line_items: custom.line_items || [{
    title: tools.random(),
    price: tools.randomInt()
  }]
});

suite.forElement('ecommerce', 'orders', order({}), schema, (test) => {
  test.should.supportCruds();
});
