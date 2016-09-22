'use strict';

const suite = require('core/suite');
const payload = require('./assets/variant-values');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const variantValuesPayload = build({ value: tools.random(), code: tools.random(), displayOrder: tools.randomInt() });

suite.forElement('ecommerce', 'products/variant-values', { payload: variantValuesPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "value": "mode",
        "code": "sample_code_2",
        "displayOrder": 99
      }
    }
  };
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'value = \'shape\'' } }).should.return200OnGet();
});
