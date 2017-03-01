'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const chakram = require('chakram');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const accountsPayload = build({ Name: tools.random(), SKU: tools.random() });

suite.forElement('payment', 'products', { payload: accountsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(2);
  test.should.supportCeqlSearch('id');
});
