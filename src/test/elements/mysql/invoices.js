'use strict';

const suite = require('core/suite');
const payload = require('./assets/invoices');
const update = () => ({
  "amount": "100",
  "quantity": "5"
});

const options = { churros: { updatePayload: update() } };
suite.forElement('db', 'invoice', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
