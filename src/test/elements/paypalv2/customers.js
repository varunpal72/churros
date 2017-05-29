'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const options = {
  churros: {
    updatePayload: {
      "op": "replace",
      "path": "/billing_address/line1",
      "value": "Some other value"
    }
  }
};

suite.forElement('payment', 'customers', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('external_customer_id');

  //TODO use this cust/ card to create a payment here...
});