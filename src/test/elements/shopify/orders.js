'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const order = (custom) => ({
  line_items: custom.line_items || [{
    title: tools.random(),
    price: tools.randomInt()
  }]
});

suite.forElement('ecommerce', 'orders', order({}), (test) => {
  test.should.supportCruds();
});
