'use strict';

const suite = require('core/suite');
const payload = require('./assets/company');
const options = {
  churros: {
    updatePayload: {
      "website": "test",
      "billing_street_address": "test",
      "billing_state_or_province": "test"
    }
  }
};
suite.forElement('db', 'company', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
