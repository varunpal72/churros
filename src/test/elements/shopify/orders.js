'use strict';

const tester = require('core/tester');
const tools = require('core/tools');
const schema = require('./assets/orders.schema');


const order = (custom) => new Object({
  line_items: custom.line_items || [
    {
      title: tools.random(),
      price: tools.randomInt()
    }
  ]
});

tester.for('ecommerce', 'orders', schema, (api) => {
  tester.it.shouldSupportCruds(order({}));
});
