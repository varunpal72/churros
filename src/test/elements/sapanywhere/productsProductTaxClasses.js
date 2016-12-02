'use strict';

const suite = require('core/suite');
const payload = require('./assets/product-tax-classes');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const taxPayload = build({ description: tools.random() });

suite.forElement('ecommerce', 'products/product-tax-classes', { payload: taxPayload, skip: true }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "description": "standard_101"
      }
    }
  };
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'description = \'Special\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'description = \'Special\'' } }).should.return200OnGet();
});
