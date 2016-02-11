'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const schema = require('./assets/discounts.schema');

const discount = (custom) => new Object({
  code: custom.code || tools.random(),
  discount_type: custom.discount_type || 'percentage',
  usage_limit: custom.usage_limit || 5,
  value: custom.value || 100
});

suite.forElement('ecommerce', 'discounts', discount({}), schema, (test) => {
  test.should.supportCrds();
});
