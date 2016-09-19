'use strict';

const suite = require('core/suite');
const payload = require('./assets/brands');
const tools = require('core/tools');

suite.forElement('ecommerce', 'products/brands', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": "Honda"
      }
    }
  };
  payload.name = tools.random();
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'BPL\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'name = \'Yonex\'' } }).should.return200OnGet();
});
