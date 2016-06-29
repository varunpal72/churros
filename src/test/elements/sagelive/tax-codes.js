'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-codes');

suite.forElement('sage', 'tax-codes', { payload: payload }, (test) => {
  var options = {
    churros: { updatePayload: { "Name": "Churros update" } }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
