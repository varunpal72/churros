'use strict';

const suite = require('core/suite');
const payload = require('./assets/product-tax-classes');
const tools = require('core/tools');

suite.forElement('ecommerce', 'products/product-tax-classes', { payload: payload }, (test) => {
  const productTaxClassesUpdate = () => ({
    "description": "standard_101"
  });
  const options = {
    churros: {
      updatePayload: productTaxClassesUpdate()
    }
  };
  payload.description = tools.random();
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'description = \'Special\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'description = \'Special\'' } }).should.return200OnGet();
});
