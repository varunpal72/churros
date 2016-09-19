'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const tools = require('core/tools');

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "lastName": "Lallana_3"
      }
    }
  };
  payload.lastName = tools.random();
  payload.firstName = tools.random();
  payload.mobile = tools.randomInt()+'7653' + tools.randomInt();
  test.should.supportCrus();
  test.should.supportSr();
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(`${test.api}/valid-values`).withOptions({ qs: { fieldName: 'title' } }).should.return200OnGet();
});
