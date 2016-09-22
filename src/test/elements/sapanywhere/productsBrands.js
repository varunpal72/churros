'use strict';

const suite = require('core/suite');
const productsPayload = require('./assets/brands');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, productsPayload, overrides);
const payload = build({ name: tools.random() });

suite.forElement('ecommerce', 'products/brands', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": "Honda"
      }
    }
  };
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'BPL\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'name = \'Yonex\'' } }).should.return200OnGet();
});
