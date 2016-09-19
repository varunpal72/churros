'use strict';

const suite = require('core/suite');
const payload = require('./assets/manufacturers');
const tools = require('core/tools');

suite.forElement('ecommerce', 'products/manufacturers', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": "Adidas"
      }
    }
  };
  payload.name = tools.random();
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Adidas\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'name = \'Adidas\'' } }).should.return200OnGet();
});
