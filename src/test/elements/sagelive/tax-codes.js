'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-codes');

const options = {
  churros: {
    updatePayload: {
      "Name": "Churros update",
    }
  }
};

suite.forElement('sage', 'tax-codes', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
