'use strict';

const suite = require('core/suite');
const payload = require('./assets/employees');
const tools = require('core/tools');

suite.forElement('finance', 'employees', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "familyName": tools.random(),
        "givenName": tools.random(),
        "displayName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('displayName');
});
