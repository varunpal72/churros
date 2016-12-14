'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-codes');

suite.forElement('sageaccounting', 'tax-codes', { payload: payload, skip: true }, (test) => {
  var options = {
    churros: { updatePayload: { "Name": "Churros update" } }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
