'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/employee.json`);
const options = {
  churros: {
    updatePayload: {
      "FirstName": "test",
    	"PostalCode": "12345"
    }
  }
};
suite.forElement('db', 'Employee', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
