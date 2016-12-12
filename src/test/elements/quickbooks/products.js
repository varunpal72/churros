'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const products = build({ sku: tools.random(), name: tools.random()});

suite.forElement('finance', 'products', { payload: products, skip: true}, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "sku": tools.random(),
        "name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('totalAmt');
});
