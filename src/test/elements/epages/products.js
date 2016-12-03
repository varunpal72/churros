'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/products');
const build = (overrides) => Object.assign({}, payload, overrides);
const productPayload = build({ productNumber: tools.random(), name: tools.randomStr(), shortDescription: tools.randomStr(), manufacturer: tools.randomStr(), price: tools.randomInt(), description: tools.randomStr() });
const options = {
  churros: {
    updatePayload: {
      "op": "add",
      "path": "/name",
      "value": tools.randomStr()
    }
  }
};

suite.forElement('ecommerce', 'products', { payload: productPayload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});