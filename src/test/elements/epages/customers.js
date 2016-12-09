'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/customers');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ customerNumber: tools.randomInt() });
const options = {
  churros: {
    updatePayload: {
      "op": "add",
      "path": "/customerNumber",
      "value": tools.randomInt()
    }
  },
  skip: true //can't delete
};

suite.forElement('ecommerce', 'customers', { payload: customersPayload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCrus();
});