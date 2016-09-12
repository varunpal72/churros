'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const tools = require('core/tools');

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  const customersUpdate = () => ({
    "lastName": "Lallana_3"
  });
  const mobNumber = '1837653';
  const options = {
    churros: {
      updatePayload: customersUpdate()
    }
  };
  payload.lastName = tools.random();
  payload.firstName = tools.random();
  payload.mobile = '' + mobNumber + '' + tools.randomInt();
  test.should.supportCrus();
  test.should.supportSr();
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(`${test.api}/valid-values`).withOptions({ qs: { fieldName: 'title' } }).should.return200OnGet();
});
