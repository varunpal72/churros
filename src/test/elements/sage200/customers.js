'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

const customerUpdate = () => ({
  "website": "www.cloud-elements.com"
});

const options = {
  churros: {
    updatePayload: customerUpdate()
  }
};

suite.forElement('finance', 'customers', payload, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
