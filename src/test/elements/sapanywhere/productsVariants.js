'use strict';

const suite = require('core/suite');
const payload = require('./assets/variants');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const variantPayload = build({ name: tools.random(), description: tools.random() });

suite.forElement('ecommerce', 'products/variants', { payload: variantPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "description": "Another test22",
        "name": "mode12"
      }
    }
  };
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'color\'' } }).should.return200OnGet();
});
