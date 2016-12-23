'use strict';

const suite = require('core/suite');
const payload = require('./assets/employee');
const update = () => ({
  "FirstName": "test",
	"PostalCode": "12345"
});

const options = { churros: { updatePayload: update() } };
suite.forElement('db', 'Employee', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
