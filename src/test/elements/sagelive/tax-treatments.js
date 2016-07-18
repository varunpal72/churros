'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-treatments');

suite.forElement('sage', 'tax-treatments', { payload: payload }, (test) => {
  var options = {
    churros: { updatePayload: { "Name": "Churros update" } }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});