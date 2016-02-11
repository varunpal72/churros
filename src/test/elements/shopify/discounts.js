'use strict';

const tester = require('core/tester');
const tools = require('core/tools');
const schema = require('./assets/discounts.schema');

const discount = (custom) => new Object({
  code: custom.code || tools.random(),
  discount_type: custom.discount_type || 'percentage',
  usage_limit: custom.usage_limit || 5,
  value: custom.value || 100
});

tester.for('ecommerce', 'discounts', schema, (api) => {
  tester.it.shouldSupportCrds(discount({}));
});
