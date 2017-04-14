'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/customers.json`);
const customerUpdate = () => ({
  "website": "www.cloud-elements.com"
});

const options = {
  churros: {
    updatePayload: customerUpdate()
  }
};

suite.forElement('finance', 'customers', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
