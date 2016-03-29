'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const discount = (custom) => ({
  code: custom.code || tools.random(),
  discount_type: custom.discount_type || 'percentage',
  usage_limit: custom.usage_limit || 5,
  value: custom.value || 100
});

suite.forElement('ecommerce', 'discounts', { payload: discount({}) }, (test) => {
  test.should.supportCrds();
});
