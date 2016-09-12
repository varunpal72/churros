'use strict';

const suite = require('core/suite');
const payload = require('./assets/variant-values');
const tools = require('core/tools');

suite.forElement('ecommerce', 'products/variant-values', { payload: payload }, (test) => {
  const variantValuesUpdate = () => ({
    "value": "mode",
    "code": "sample_code_2",
    "displayOrder": 99
  });
  const options = {
    churros: {
      updatePayload: variantValuesUpdate()
    }
  };
  payload.value = tools.random();
  payload.code = tools.random();
  payload.displayOrder = tools.randomInt();
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'value = \'shape\'' } }).should.return200OnGet();
});
