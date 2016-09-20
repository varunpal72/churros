'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ lastName: tools.random(), firstName: tools.random(), mobile: tools.randomInt() + '7153' + tools.randomInt() });

suite.forElement('ecommerce', 'customers', { payload: customersPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "lastName": "Lallana_3"
      }
    }
  };
  test.should.supportCrus();
  test.should.supportSr();
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(`${test.api}/valid-values`).withOptions({ qs: { fieldName: 'title' } }).should.return200OnGet();
});
