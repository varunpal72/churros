'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ ProductName: tools.random(), ProductCode: tools.random() });

suite.forElement('ecommerce', 'products', { payload: productsPayload }, (test) => {
  const updatePayload = {
        "ProductDescription": tools.random()
  };

  test.withOptions({ churros: { updatePayload: updatePayload } }).should.supportCruds();
  test.withOptions({ qs: { where: 'LastModified>=\'6/2/2011 4:43:00 PM\'' } }).should.return200OnGet();

});
